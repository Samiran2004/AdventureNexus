import { Schema } from "mongoose";

export class UserDto {
    clerkUserId: string;
    fullname?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
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