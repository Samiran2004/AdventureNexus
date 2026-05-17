import { Schema, model } from 'mongoose';
import { ICommunity } from '../../dtos/CommunityDTO';

const communitySchema = new Schema<ICommunity>({
    name: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true },
    bannerImage: { type: String },
    followersCount: { type: Number, default: 0 },
    rules: [{ type: String }],
}, { timestamps: true });

const Community = model<ICommunity>('Community', communitySchema);
export default Community;
