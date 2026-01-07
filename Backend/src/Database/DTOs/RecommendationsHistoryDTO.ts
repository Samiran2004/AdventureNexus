import { Document, Schema } from 'mongoose'; // Added imports to fix potential missing types

/**
 * Interface for tracking User's Recommendation History.
 * Stores a list of references to past recommendations/plans.
 */
export interface RecommendationsHistoryDTO extends Document {
    userId: Schema.Types.ObjectId,
    recommendationhistory: Schema.Types.ObjectId[]
}
