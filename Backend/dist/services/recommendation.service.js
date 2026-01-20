"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendationsForUser = void 0;
const planModel_1 = __importDefault(require("../database/models/planModel"));
const userModel_1 = __importDefault(require("../database/models/userModel"));
const logger_1 = __importDefault(require("../utils/logger"));
const WEIGHTS = {
    TRAVEL_STYLE: 2.0,
    BUDGET_RANGE: 1.5,
    PERFECT_FOR: 1.2,
    ACTIVITIES: 1.0,
    PREFERENCE: 2.5
};
const getWeightedTokens = (plan) => {
    var _a, _b;
    const tokens = new Map();
    const addToken = (term, weight) => {
        if (!term)
            return;
        const t = term.toLowerCase().trim();
        if (t.length === 0)
            return;
        tokens.set(t, (tokens.get(t) || 0) + weight);
    };
    if (plan.travel_style)
        addToken(plan.travel_style, WEIGHTS.TRAVEL_STYLE);
    if (plan.budget_range)
        addToken(plan.budget_range, WEIGHTS.BUDGET_RANGE);
    (_a = plan.activities) === null || _a === void 0 ? void 0 : _a.forEach(a => addToken(a, WEIGHTS.ACTIVITIES));
    (_b = plan.perfect_for) === null || _b === void 0 ? void 0 : _b.forEach(p => addToken(p, WEIGHTS.PERFECT_FOR));
    return tokens;
};
const calculateIDF = (plans) => {
    const docCount = plans.length;
    const termDocs = new Map();
    plans.forEach(plan => {
        var _a, _b;
        const uniqueTerms = new Set();
        if (plan.travel_style)
            uniqueTerms.add(plan.travel_style.toLowerCase().trim());
        if (plan.budget_range)
            uniqueTerms.add(plan.budget_range.toLowerCase().trim());
        (_a = plan.activities) === null || _a === void 0 ? void 0 : _a.forEach(a => uniqueTerms.add(a.toLowerCase().trim()));
        (_b = plan.perfect_for) === null || _b === void 0 ? void 0 : _b.forEach(p => uniqueTerms.add(p.toLowerCase().trim()));
        uniqueTerms.forEach(term => {
            if (term.length > 0) {
                termDocs.set(term, (termDocs.get(term) || 0) + 1);
            }
        });
    });
    const idf = new Map();
    termDocs.forEach((count, term) => {
        idf.set(term, Math.log(docCount / (count + 1)) + 1);
    });
    return idf;
};
const itemToVector = (tokenWeights, vocabulary, idf) => {
    return vocabulary.map(term => {
        const tf = tokenWeights.get(term) || 0;
        const idfVal = idf.get(term) || 0;
        return tf * idfVal;
    });
};
const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const mAg = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const mBg = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    if (mAg === 0 || mBg === 0)
        return 0;
    return dotProduct / (mAg * mBg);
};
const getRecommendationsForUser = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, limit = 3) {
    var _a, _b, _c, _d;
    try {
        const user = yield userModel_1.default.findById(userId).populate('plans');
        if (!user)
            return [];
        const allPlans = yield planModel_1.default.find({ userId: { $ne: userId } }).limit(100).sort({ createdAt: -1 });
        if (allPlans.length === 0)
            return [];
        const idfMap = calculateIDF(allPlans);
        const vocabulary = Array.from(idfMap.keys()).sort();
        const userTokenWeights = new Map();
        const addUserToken = (term, weight) => {
            if (!term)
                return;
            const t = term.toLowerCase().trim();
            if (t.length === 0)
                return;
            userTokenWeights.set(t, (userTokenWeights.get(t) || 0) + weight);
        };
        (_a = user.preferences) === null || _a === void 0 ? void 0 : _a.forEach(p => addUserToken(p, WEIGHTS.PREFERENCE));
        const userPastPlans = user.plans;
        if (userPastPlans && userPastPlans.length > 0) {
            userPastPlans.forEach(plan => {
                var _a, _b;
                if (plan.travel_style)
                    addUserToken(plan.travel_style, WEIGHTS.TRAVEL_STYLE);
                if (plan.budget_range)
                    addUserToken(plan.budget_range, WEIGHTS.BUDGET_RANGE);
                (_a = plan.activities) === null || _a === void 0 ? void 0 : _a.forEach(a => addUserToken(a, WEIGHTS.ACTIVITIES));
                (_b = plan.perfect_for) === null || _b === void 0 ? void 0 : _b.forEach(p => addUserToken(p, WEIGHTS.PERFECT_FOR));
            });
        }
        if (userTokenWeights.size === 0) {
            return allPlans.slice(0, limit);
        }
        const userVector = itemToVector(userTokenWeights, vocabulary, idfMap);
        logger_1.default.debug(`[RecSys] User ${userId} Profile Size: ${userTokenWeights.size} tokens`);
        const scoredPlans = allPlans.map(plan => {
            const planWeights = getWeightedTokens(plan);
            const planVector = itemToVector(planWeights, vocabulary, idfMap);
            const score = cosineSimilarity(userVector, planVector);
            if (score > 0.1) {
                logger_1.default.debug(`[RecSys] Candidate: ${plan.name} | Score: ${score.toFixed(4)}`);
            }
            return { plan, score };
        });
        scoredPlans.sort((a, b) => b.score - a.score);
        logger_1.default.info(`[RecSys] Top Match: ${(_c = (_b = scoredPlans[0]) === null || _b === void 0 ? void 0 : _b.plan) === null || _c === void 0 ? void 0 : _c.name} (${(_d = scoredPlans[0]) === null || _d === void 0 ? void 0 : _d.score.toFixed(4)})`);
        return scoredPlans.slice(0, limit).map(item => item.plan);
    }
    catch (error) {
        logger_1.default.error("Error generating recommendations:", error);
        return [];
    }
});
exports.getRecommendationsForUser = getRecommendationsForUser;
