import User from '../models/userModel'; // Adjust the import based on your project structure

async function createUserName(fullname: string): Promise<string> {
  // Convert to lowercase and split the name
  const splitName: string[] = fullname.toLowerCase().split(' ');

  // Generate a random number
  const randomNumber: number = Math.floor(Math.random() * 9000) + 1000;

  // Create a random username by combining the first name part and random number
  const randomUserName: string = `${splitName[0]}${randomNumber}`;

  // Check if the username already exists in the database
  const checkUserName = await User.findOne({ username: randomUserName });

  if (checkUserName) {
    // Recursively generate a new username if it already exists
    return await createUserName(fullname);
  } else {
    return randomUserName;
  }
}

export default createUserName;
