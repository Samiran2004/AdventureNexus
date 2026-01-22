import User from '../database/models/userModel';

/**
 * Generates a unique username based on the user's full name.
 * Format: Firstname + Random 4-digit number.
 * Recursively checks the database to ensure uniqueness.
 *
 * @param fullname - The user's full name
 * @returns A promise that resolves to a unique username string
 */
async function createUserName(fullname: string): Promise<string> {
    // 1. Extract first name and convert to lowercase
    const splitName: string[] = fullname.toLowerCase().split(' ');

    // 2. Generate a random 4-digit number (1000 - 9999)
    const randomNumber: number = Math.floor(Math.random() * 9000) + 1000;

    // 3. Construct candidate username
    const randomUserName: string = `${splitName[0]}${randomNumber}`;

    // 4. Check uniqueness in Database
    const checkUserName = await User.findOne({ username: randomUserName });

    if (checkUserName) {
        // 5. Recursion: If exists, try again
        return await createUserName(fullname);
    } else {
        // 6. Return unique username
        return randomUserName;
    }
}

export default createUserName;
