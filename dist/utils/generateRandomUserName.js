"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel")); // Adjust the import based on your project structure
async function createUserName(fullname) {
    // Convert to lowercase and split the name
    const splitName = fullname.toLowerCase().split(' ');
    // Generate a random number
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    // Create a random username by combining the first name part and random number
    const randomUserName = `${splitName[0]}${randomNumber}`;
    // Check if the username already exists in the database
    const checkUserName = await userModel_1.default.findOne({ username: randomUserName });
    if (checkUserName) {
        // Recursively generate a new username if it already exists
        return await createUserName(fullname);
    }
    else {
        return randomUserName;
    }
}
exports.default = createUserName;
