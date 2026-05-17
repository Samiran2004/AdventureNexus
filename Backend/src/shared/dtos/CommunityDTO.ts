import { Schema, Document } from "mongoose";

/**
 * Interface for Community Posts.
 * Extends Mongoose Document.
 */
export interface ICommunityPost extends Document {
    userId: Schema.Types.ObjectId;
    clerkUserId: string;
    communityId?: Schema.Types.ObjectId; // NEW: Topic-based community
    groupId?: Schema.Types.ObjectId;     // NEW: Private/Public Group
    title: string;
    content: string;
    category: string;
    tags: string[];
    destinationTags?: string[];
    images?: string[];
    tripId?: Schema.Types.ObjectId;
    likes: string[];
    repliesCount: number;
    interactionScore?: number;
    viewCount?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICommunityComment extends Document {
    postId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    clerkUserId: string;
    content: string;
    parentId?: Schema.Types.ObjectId;
    likes: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ICommunity extends Document {
    name: string;
    displayName: string;
    bannerImage?: string;
    followersCount: number;
    rules: string[];
    createdAt: Date;
}

export interface IGroup extends Document {
    creatorId: Schema.Types.ObjectId;
    name: string;
    privacy: 'PUBLIC' | 'PRIVATE' | 'HIDDEN';
    memberCount: number;
    pendingRequests: Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IGroupMembership extends Document {
    groupId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
    joinedAt: Date;
}
