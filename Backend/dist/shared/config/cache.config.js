"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_CONFIG = void 0;
exports.CACHE_CONFIG = {
    ROOT_PREFIX: 'nexus:v1',
    DEFAULT_TTL: 3600,
    TTL: {
        PLAN_DETAILS: 600,
        RECOMMENDATIONS: 300,
        REVIEWS: 600,
        SEARCH_RESULTS: 3600,
        DESTINATION_IMAGES: 86400,
    },
    PREFIX: {
        PLAN: 'plan',
        RECOMMENDATIONS: 'recs',
        REVIEWS: 'reviews',
        SEARCH: 'search',
        IMAGES: 'images',
    }
};
