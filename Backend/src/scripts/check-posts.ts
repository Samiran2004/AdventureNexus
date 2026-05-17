import mongoose from 'mongoose';
import CommunityPost from '../shared/database/models/communityPostModel';

const MONGO_URI = 'mongodb+srv://samiran:samiran2004@cluster2004.eowyegm.mongodb.net/API-Powered-Interactive-Travel-Planner';

async function run() {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    const posts = await CommunityPost.find({});
    console.log(`Total posts in DB: ${posts.length}`);
    for (const post of posts) {
        console.log(`Post: "${post.title}", Group ID: ${post.groupId}, Category: ${post.category}`);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
