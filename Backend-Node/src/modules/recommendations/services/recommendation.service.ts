import Plan from "../../../shared/database/models/planModel";
import User from "../../../shared/database/models/userModel";
import { IPlan } from "../../../shared/dtos/PlansDTO";
import logger from "../../../shared/utils/logger";

/**
 * Recommendation Service
 * Implements Content-Based Filtering using Weighted TF-IDF and Cosine Similarity.
 */

// Weights for different fields
const WEIGHTS = {
    TRAVEL_STYLE: 2.0,
    BUDGET_RANGE: 1.5,
    PERFECT_FOR: 1.2,
    ACTIVITIES: 1.0,
    PREFERENCE: 2.5 // Explicit user preference
};

// 1. Helper to extract weighted tokens from a Plan
const getWeightedTokens = (plan: IPlan): Map<string, number> => {
    const tokens = new Map<string, number>();

    const addToken = (term: string, weight: number) => {
        if (!term) return;
        const t = term.toLowerCase().trim();
        if (t.length === 0) return;
        tokens.set(t, (tokens.get(t) || 0) + weight);
    };

    if (plan.travel_style) addToken(plan.travel_style, WEIGHTS.TRAVEL_STYLE);
    if (plan.budget_range) addToken(plan.budget_range, WEIGHTS.BUDGET_RANGE);
    plan.activities?.forEach(a => addToken(a, WEIGHTS.ACTIVITIES));
    plan.perfect_for?.forEach(p => addToken(p, WEIGHTS.PERFECT_FOR));

    return tokens;
};

// 2. Calculate IDF (Inverse Document Frequency) for the corpus
const calculateIDF = (plans: IPlan[]): Map<string, number> => {
    const docCount = plans.length;
    const termDocs = new Map<string, number>();

    plans.forEach(plan => {
        // Get unique terms in this plan to count document frequency
        const uniqueTerms = new Set<string>();
        if (plan.travel_style) uniqueTerms.add(plan.travel_style.toLowerCase().trim());
        if (plan.budget_range) uniqueTerms.add(plan.budget_range.toLowerCase().trim());
        plan.activities?.forEach(a => uniqueTerms.add(a.toLowerCase().trim()));
        plan.perfect_for?.forEach(p => uniqueTerms.add(p.toLowerCase().trim()));

        uniqueTerms.forEach(term => {
            if (term.length > 0) {
                termDocs.set(term, (termDocs.get(term) || 0) + 1);
            }
        });
    });

    const idf = new Map<string, number>();
    termDocs.forEach((count, term) => {
        // IDF = log(N / (df + 1)) + 1 (smoothing)
        idf.set(term, Math.log(docCount / (count + 1)) + 1);
    });

    return idf;
};

// 3. Convert Token Weights to Vector using Vocabulary and IDF
const itemToVector = (tokenWeights: Map<string, number>, vocabulary: string[], idf: Map<string, number>): number[] => {
    return vocabulary.map(term => {
        const tf = tokenWeights.get(term) || 0;
        const idfVal = idf.get(term) || 0; // Should exist if in vocab
        return tf * idfVal;
    });
};

// 4. Calculate Cosine Similarity
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const mAg = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const mBg = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

    if (mAg === 0 || mBg === 0) return 0;
    return dotProduct / (mAg * mBg);
};

export const getRecommendationsForUser = async (userId: string, limit: number = 3): Promise<IPlan[]> => {
    try {
        // A. Fetch User & Their Interactions
        const user = await User.findById(userId).populate('plans');
        if (!user) return [];

        // B. Fetch All Candidate Plans
        const allPlans = await Plan.find({ userId: { $ne: userId } }).limit(100).sort({ createdAt: -1 });

        if (allPlans.length === 0) return [];

        // C. Calculate Global IDF and Vocabulary from all plans
        const idfMap = calculateIDF(allPlans);
        const vocabulary = Array.from(idfMap.keys()).sort();

        // D. Build User Profile Profile (Features from history)
        const userTokenWeights = new Map<string, number>();

        const addUserToken = (term: string, weight: number) => {
            if (!term) return;
            const t = term.toLowerCase().trim();
            if (t.length === 0) return;
            userTokenWeights.set(t, (userTokenWeights.get(t) || 0) + weight);
        };

        // Explicit interactions
        user.preferences?.forEach(p => addUserToken(p, WEIGHTS.PREFERENCE));

        // Implicit interactions from past plans
        const userPastPlans = user.plans as unknown as IPlan[];
        if (userPastPlans && userPastPlans.length > 0) {
            userPastPlans.forEach(plan => {
                if (plan.travel_style) addUserToken(plan.travel_style, WEIGHTS.TRAVEL_STYLE);
                if (plan.budget_range) addUserToken(plan.budget_range, WEIGHTS.BUDGET_RANGE);
                plan.activities?.forEach(a => addUserToken(a, WEIGHTS.ACTIVITIES));
                plan.perfect_for?.forEach(p => addUserToken(p, WEIGHTS.PERFECT_FOR));
            });
        }

        // If user has no profile, return popular/latest
        if (userTokenWeights.size === 0) {
            return allPlans.slice(0, limit);
        }

        // E. Vectorize User
        const userVector = itemToVector(userTokenWeights, vocabulary, idfMap);

        logger.debug(`[RecSys] User ${userId} Profile Size: ${userTokenWeights.size} tokens`);

        // F. Score Candidates
        const scoredPlans = allPlans.map(plan => {
            const planWeights = getWeightedTokens(plan);
            const planVector = itemToVector(planWeights, vocabulary, idfMap);
            const score = cosineSimilarity(userVector, planVector);

            if (score > 0.1) {
                logger.debug(`[RecSys] Candidate: ${plan.name} | Score: ${score.toFixed(4)}`);
            }

            return { plan, score };
        });

        // G. Sort & Return
        scoredPlans.sort((a, b) => b.score - a.score);
        logger.info(`[RecSys] Top Match: ${scoredPlans[0]?.plan?.name} (${scoredPlans[0]?.score.toFixed(4)})`);

        return scoredPlans.slice(0, limit).map(item => item.plan);

    } catch (error) {
        logger.error("Error generating recommendations:", error);
        return [];
    }
};
