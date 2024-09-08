const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    phonenumber: {
        type: Number,
        required: true,
        unique: true,
        minlength: [10, 'Phone number must be 10 digits long'],
        maxlength: [10, 'Phone number must be 10 digits long'],
        match: [/^\d{10}$/, 'Phone number must contain exactly 10 digits']
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },
    profilepicture: {
        type: String,
        default: () => {
            return this.gender == 'male' ? "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeIUUwf1GuV6YhA08a9haUQBOBRqJinQCJxA&s"
        }
    },
    preferences: {
        type: [String],
        enum: ['adventure', 'relaxation', 'culture', 'nature', 'beach', 'mountains', 'urban'],
        default: ['relaxation', 'nature', 'beach'],
    },
    country: {
        type: String
    },
    createdat: {
        type: Date,
        default: Date.now,
    },
    refreshtoken: {
        type: String
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;