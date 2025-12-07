"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var subscribeUserMailSchema = new mongoose_1.default.Schema({
    mail: {
        type: String,
        unique: true,
        required: true
    }
}, { timestamps: true });
var SubscribeMail = mongoose_1.default.model('SubscribeMail', subscribeUserMailSchema);
exports.default = SubscribeMail;
