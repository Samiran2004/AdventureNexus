const User = require('../models/userModel');

module.exports = async function createuserName(fullname) {
    // Convert to lowercase and split the name
    const splitName = fullname.toLowerCase().split(" ");
    
    // Generate a random number
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;

    // Create a random username by combining the first name part and random number
    const randomUserName = `${splitName[0]}${randomNumber}`;

    // Check if the username already exists in the database
    const checkUserName = await User.findOne({ username: randomUserName });

    if (checkUserName) {
        // Recursively generate a new username if it already exists
        return await createuserName(fullname);
    } else {
        return randomUserName;
    }
};