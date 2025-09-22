export interface RecommendationsHistoryDTO extends Document {
    userId: Schema.Types.ObjectId,
    recommendationhistory: Schema.Types.ObjectId[]
}
