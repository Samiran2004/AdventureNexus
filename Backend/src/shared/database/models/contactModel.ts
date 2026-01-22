import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: false,
        default: null
    },
    email: {
        type: String,
        required: true
    }
});

const Contact = new mongoose.model('Contact', contactSchema);

module.exports = Contact;
