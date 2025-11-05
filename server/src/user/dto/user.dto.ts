import { Document, Schema } from "mongoose";

export interface UserDto extends Document {
    clerkUserId: string;
    fullname?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    username?: string;
    phonenumber?: number;
    profilepicture?: string;
    preferences?: string[];
    country?: string;
    createdat?: Date;
    refreshtoken?: string;
    currency_code?: string;
    plans?: Schema.Types.ObjectId[];
}