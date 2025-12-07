import mongoose from "mongoose";

const subscribeUserMailSchema = new mongoose.Schema({
    mail: {
        type: String,
        unique: true,
        required: true
    }
}, {timestamps: true});

const SubscribeMail = mongoose.model('SubscribeMail', subscribeUserMailSchema);

export default SubscribeMail;