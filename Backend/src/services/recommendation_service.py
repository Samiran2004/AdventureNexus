import math
from typing import List, Dict, Any, Tuple
from beanie import PydanticObjectId
import logging

from src.database.models.plan import Plan
from src.database.models.user import User

logger = logging.getLogger(__name__)

# Weights for different fields
WEIGHTS = {
    "TRAVEL_STYLE": 2.0,
    "BUDGET_RANGE": 1.5,
    "PERFECT_FOR": 1.2,
    "ACTIVITIES": 1.0,
    "PREFERENCE": 2.5
}

def get_weighted_tokens(plan: Plan) -> Dict[str, float]:
    tokens: Dict[str, float] = {}

    def add_token(term: str, weight: float):
        if not term:
            return
        t = term.lower().strip()
        if not t:
            return
        tokens[t] = tokens.get(t, 0) + weight

    if plan.travel_style:
        add_token(plan.travel_style, WEIGHTS["TRAVEL_STYLE"])
    if plan.budget_range:
        add_token(plan.budget_range, WEIGHTS["BUDGET_RANGE"])
    
    for a in (plan.activities or []):
        add_token(a, WEIGHTS["ACTIVITIES"])
        
    for p in (plan.perfect_for or []):
        add_token(p, WEIGHTS["PERFECT_FOR"])

    return tokens

def calculate_idf(plans: List[Plan]) -> Dict[str, float]:
    doc_count = len(plans)
    term_docs: Dict[str, int] = {}

    for plan in plans:
        unique_terms = set()
        if plan.travel_style: unique_terms.add(plan.travel_style.lower().strip())
        if plan.budget_range: unique_terms.add(plan.budget_range.lower().strip())
        for a in (plan.activities or []): unique_terms.add(a.lower().strip())
        for p in (plan.perfect_for or []): unique_terms.add(p.lower().strip())

        for term in unique_terms:
            if term:
                term_docs[term] = term_docs.get(term, 0) + 1

    idf: Dict[str, float] = {}
    for term, count in term_docs.items():
        idf[term] = math.log(doc_count / (count + 1)) + 1

    return idf

def item_to_vector(token_weights: Dict[str, float], vocabulary: List[str], idf: Dict[str, float]) -> List[float]:
    return [token_weights.get(term, 0) * idf.get(term, 0) for term in vocabulary]

def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    mag_a = math.sqrt(sum(a * a for a in vec_a))
    mag_b = math.sqrt(sum(b * b for b in vec_b))

    if mag_a == 0 or mag_b == 0:
        return 0
    return dot_product / (mag_a * mag_b)

async def get_recommendations_for_user(user_id: PydanticObjectId, limit: int = 3) -> List[Plan]:
    try:
        user = await User.get(user_id, fetch_links=True)
        if not user:
            return []

        all_plans = await Plan.find(Plan.userId != user_id).sort(-Plan.createdAt).limit(100).to_list()
        
        if not all_plans:
            return []

        idf_map = calculate_idf(all_plans)
        vocabulary = sorted(list(idf_map.keys()))

        user_token_weights: Dict[str, float] = {}

        def add_user_token(term: str, weight: float):
            if not term: return
            t = term.lower().strip()
            if not t: return
            user_token_weights[t] = user_token_weights.get(t, 0) + weight

        for p in (user.preferences or []):
            add_user_token(p, WEIGHTS["PREFERENCE"])

        # Implicit interactions
        # The node version populated user.plans, but beanie doesn't have native populate on lists of strings unless defined as Link objects.
        # Let's fetch plans for this user manually.
        user_past_plans = await Plan.find(Plan.userId == user_id).to_list()
        
        for plan in user_past_plans:
            if plan.travel_style: add_user_token(plan.travel_style, WEIGHTS["TRAVEL_STYLE"])
            if plan.budget_range: add_user_token(plan.budget_range, WEIGHTS["BUDGET_RANGE"])
            for a in (plan.activities or []): add_user_token(a, WEIGHTS["ACTIVITIES"])
            for p in (plan.perfect_for or []): add_user_token(p, WEIGHTS["PERFECT_FOR"])

        if not user_token_weights:
            return all_plans[:limit]

        user_vector = item_to_vector(user_token_weights, vocabulary, idf_map)

        scored_plans: List[Tuple[Plan, float]] = []
        for plan in all_plans:
            plan_weights = get_weighted_tokens(plan)
            plan_vector = item_to_vector(plan_weights, vocabulary, idf_map)
            score = cosine_similarity(user_vector, plan_vector)
            scored_plans.append((plan, score))

        scored_plans.sort(key=lambda x: x[1], reverse=True)
        
        return [item[0] for item in scored_plans[:limit]]

    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        return []
