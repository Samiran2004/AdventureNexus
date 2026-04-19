/**
 * Centralized Cache Configuration
 * Professional oversight of all caching rules in the AdventureNexus backend.
 */
export const CACHE_CONFIG = {
    ROOT_PREFIX: 'nexus:v1',
    DEFAULT_TTL: 3600, // 1 Hour

    // Domain Specific TTLs (in seconds)
    TTL: {
        PLAN_DETAILS: 600,         // 10 Minutes
        RECOMMENDATIONS: 300,      // 5 Minutes
        REVIEWS: 600,              // 10 Minutes
        SEARCH_RESULTS: 3600,      // 1 Hour
        DESTINATION_IMAGES: 86400, // 24 Hours
    },

    // Domain Specific Prefixes
    PREFIX: {
        PLAN: 'plan',
        RECOMMENDATIONS: 'recs',
        REVIEWS: 'reviews',
        SEARCH: 'search',
        IMAGES: 'images',
    }
};
