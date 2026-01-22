"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subscribeMailSchema = new mongoose_1.Schema({
    userMail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    }
}, { timestamps: true });
const SubscribeMail = (0, mongoose_1.model)("SubscribeMail", subscribeMailSchema);
exports.default = SubscribeMail;
