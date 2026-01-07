import { Schema, model, Document, ObjectId } from 'mongoose';

export interface IRecommendation extends Document {
    _id: ObjectId;
    destination: string;
    details: string;
    budget: number;
    totalPerson: number;
    recommendationOn: Date;
    user?: Schema.Types.ObjectId; // Optional if user may not be provided
}

const recommendationSchema = new Schema<IRecommendation>(
    {
        destination: {
            type: String,
            required: true,
        },
        details: {
            type: String,
            required: true,
        },
        budget: {
            type: Number,
            required: true,
        },
        totalPerson: {
            type: Number,
            default: 1,
        },
        recommendationOn: {
            type: Date,
            default: Date.now,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const Recommendations = model<IRecommendation>(
    'Recommendations',
    recommendationSchema
);
export default Recommendations;
