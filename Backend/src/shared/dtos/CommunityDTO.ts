import { Schema, Document } from "mongoose";

/**
 * Interface for Community Posts.
 * Extends Mongoose Document.
 */
export interface ICommunityPost extends Document {
    userId: Schema.Types.ObjectId; // Reference to local User ID
    clerkUserId: string;           // Reference to Clerk User ID
    title: string;                 // Title of the discussion
    content: string;               // Main content of the post
    category: string;             // Topic category
    tags: string[];                // Optional tags
    likes: string[];               // Array of ClerkUserIds who liked the post
    repliesCount: number;          // Total number of replies (denormalized)
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Interface for Community Comments.
 * Extends Mongoose Document.
 */
export interface ICommunityComment extends Document {
    postId: Schema.Types.ObjectId; // Reference to the parent Post
    userId: Schema.Types.ObjectId; // Reference to local User ID
    clerkUserId: string;           // Reference to Clerk User ID
    content: string;               // Comment content
    likes: string[];               // Array of ClerkUserIds who liked the comment
    createdAt: Date;
    updatedAt: Date;
}
