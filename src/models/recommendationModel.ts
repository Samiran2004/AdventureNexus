import { Schema, model, Document } from 'mongoose';

interface IRecommendation extends Document {
    destination: string;
    details: string;
    budget: number;
    totalPerson: number;
    recommendationOn: Date;
    user?: Schema.Types.ObjectId; // Optional if user may not be provided
}

const recommendationSchema = new Schema<IRecommendation>({
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
        required: true
    },
    totalPerson: {
        type: Number,
        default: 1
    },
    recommendationOn: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Recommendations = model<IRecommendation>('Recommendations', recommendationSchema);
export default Recommendations;