import mongoose, { Schema, Document, model } from 'mongoose';

export type ActivityType = string;

export interface IActivityLog extends Document {
    clerkUserId: string;
    activityType: ActivityType;
    targetId: string; // postId, groupId, etc.
    createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
    {
        clerkUserId: { type: String, required: true, index: true },
        activityType: { 
            type: String, 
            required: true 
        },
        targetId: { type: String, required: true },
        username: { type: String },
        details: { type: String }
    },
    { timestamps: true }
);

// Add index for fast querying by user and activity
activityLogSchema.index({ clerkUserId: 1, activityType: 1 });

const ActivityLog = model<IActivityLog>('ActivityLog', activityLogSchema);
export default ActivityLog;
