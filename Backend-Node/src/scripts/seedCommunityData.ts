import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CommunityEvent from '../shared/database/models/communityEventModel';
import CommunitySpotlight from '../shared/database/models/communitySpotlightModel';

dotenv.config();

const MONGO_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/adventurenexus';

const seedCommunityData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding community data...');

        // Clear existing data
        await CommunityEvent.deleteMany({});
        await CommunitySpotlight.deleteMany({});

        // Seed Events
        const events = [
            {
                title: "Global Travel Photography Workshop",
                description: "Join world-renowned photographer Elena R. for a masterclass on capturing breathtaking landscapes in low light.",
                date: new Date('2025-11-15T18:30:00Z'),
                type: 'Webinar',
                attendees: ['clerk_123', 'clerk_456'],
                imageUrl: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c03?w=800&auto=format&fit=crop&q=60'
            },
            {
                title: "Community Meetup: Barcelona",
                description: "An evening of tapas and travel stories. Meet fellow adventurers at the Gothic Quarter.",
                date: new Date('2025-12-02T19:00:00Z'),
                type: 'In-Person',
                location: 'Bar del Pla, Barcelona, Spain',
                attendees: ['clerk_789'],
                imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&auto=format&fit=crop&q=60'
            },
            {
                title: "Sustainable Travel Forum 2026",
                description: "Learn how to minimize your footprint while maximizing your impact.",
                date: new Date('2026-01-20T10:00:00Z'),
                type: 'Webinar',
                attendees: [],
                imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60'
            }
        ];

        await CommunityEvent.insertMany(events);
        console.log('Successfully seeded 3 community events.');

        // Seed Spotlight
        const spotlight = {
            title: "Alex's Journey Across the Andes",
            description: "From peak to peak: A 3-month odyssey planned with precision.",
            content: "Read how Alex used AdventureNexus to navigate the rugged trails of South America, discovering hidden villages and ancient secrets.",
            imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=60',
            link: '/stories/andes-journey',
            isActive: true
        };

        await CommunitySpotlight.create(spotlight);
        console.log('Successfully seeded member spotlight.');

        await mongoose.disconnect();
        console.log('Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding community data:', error);
        process.exit(1);
    }
};

seedCommunityData();
