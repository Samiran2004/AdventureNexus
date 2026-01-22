import mongoose, { Schema } from "mongoose";
import { RecommendationsHistoryDTO } from "../DTOs/RecommendationsHistoryDTO";

const recommendationHistoryModel = new mongoose.Schema<RecommendationsHistoryDTO>({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    recommendationhistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Recommendations',
        }
    ]


}, { timestamps: true });

const RecommendationsHistory = mongoose.model<RecommendationsHistoryDTO>('RecommendationsHistory', recommendationHistoryModel);

export default RecommendationsHistory;
