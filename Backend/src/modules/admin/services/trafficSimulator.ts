import User from '../../../shared/database/models/userModel';
import Plan from '../../../shared/database/models/planModel';
import Review from '../../../shared/database/models/reviewModel';
import ActivityLog from '../../../shared/database/models/activityLogModel';
import { broadcastRealtimeEvent } from '../../../shared/socket/socket';
import logger from '../../../shared/utils/logger';

let simulationInterval: NodeJS.Timeout | null = null;

const MOCK_NAMES = [
    'Emma Watson', 'Liam Neeson', 'Olivia Wilde', 'Noah Centineo', 
    'Ava DuVernay', 'Oliver Stone', 'Sophia Loren', 'Elijah Wood', 
    'Isabella Rossellini', 'Lucas Hedges', 'Mia Farrow', 'Mason Mount'
];

const MOCK_USERNAMES = [
    'emma_wanders', 'liam_expeditions', 'olivia_trekker', 'noah_voyage', 
    'ava_summit', 'oliver_trail', 'sophia_nomad', 'elijah_explorer', 
    'isabella_scout', 'lucas_journey', 'mia_globetrotter', 'mason_peaks'
];

const MOCK_LOCATIONS = [
    'Paris, France', 'Kyoto, Japan', 'Reykjavik, Iceland', 'Cairo, Egypt', 
    'Queenstown, New Zealand', 'Cusco, Peru', 'Cape Town, South Africa'
];

const MOCK_COMMENTS = [
    'Incredible journey! The local tips were absolute gold.',
    'Very disappointing. The flights recommended were delayed and the customer care was worst. Highly suspect this is a scam!',
    'Loved the cultural exploration in Kyoto. Definitely recommend family adventure.',
    'Absolute waste of money. Completely fake itineraries and cheat accommodation! Worst support.',
    'Breathtaking views. Highly organized and seamless logistics.',
    'Do not buy these plans! This is a total scam. They hacked my payments. Bad experience!',
    'Stunning solo expedition. Felt fully safe and authenticated.'
];

const TRIP_TYPES = ['solo', 'family', 'couple', 'adventure', 'cultural', 'business', 'nature'];

export const startSimulator = (intervalMs: number = 4000) => {
    if (simulationInterval) return;

    logger.info(`[TRAFFIC SIMULATOR] Launching mock live ingestion flow every ${intervalMs}ms`);

    simulationInterval = setInterval(async () => {
        try {
            const dice = Math.random();

            if (dice < 0.3) {
                // 1. Simulate User Registration
                const randomIndex = Math.floor(Math.random() * MOCK_NAMES.length);
                const fullname = MOCK_NAMES[randomIndex];
                const username = `${MOCK_USERNAMES[randomIndex]}_${Math.floor(Math.random() * 100)}`;
                const clerkUserId = `user_mock_${Math.random().toString(36).substr(2, 9)}`;
                const email = `${username}@nexus-mock.com`;

                const newUser = await User.create({
                    clerkUserId,
                    username,
                    email,
                    fullname,
                    profilepicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname)}&background=10b981&color=fff`,
                    role: 'user'
                });

                // Track and Broadcast
                const log = await ActivityLog.create({
                    clerkUserId,
                    activityType: 'user_created',
                    targetId: newUser._id.toString(),
                    details: `New operator registered: @${username}`,
                    username
                });

                broadcastRealtimeEvent('activity:new', log);
                broadcastRealtimeEvent('user:online', clerkUserId);
                broadcastRealtimeEvent('simulator:user:new', newUser);

                logger.info(`[SIMULATOR] Ingested mock registration: @${username}`);

            } else if (dice < 0.6) {
                // 2. Simulate Expedition Generation
                const destination = MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)];
                const days = Math.floor(Math.random() * 7) + 3;
                const budget = Math.floor(Math.random() * 3000) + 800;
                
                const newPlan = await Plan.create({
                    to: destination,
                    days,
                    budget,
                    travelers: Math.floor(Math.random() * 4) + 1,
                    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 30)),
                    name: `AI Exploration: ${destination.split(',')[0]}`,
                    clerkUserId: `user_mock_${Math.random().toString(36).substr(2, 9)}`
                });

                const log = await ActivityLog.create({
                    clerkUserId: newPlan.clerkUserId,
                    activityType: 'create_experience_post',
                    targetId: newPlan._id.toString(),
                    details: `Ingested new AI travel dossier to ${destination}`,
                    username: 'nexus_ai'
                });

                broadcastRealtimeEvent('activity:new', log);
                broadcastRealtimeEvent('simulator:plan:new', newPlan);

                logger.info(`[SIMULATOR] Ingested mock itinerary to ${destination}`);

            } else {
                // 3. Simulate Testimonial Feedback (With safety flags for the toxicity detector)
                const randomIndex = Math.floor(Math.random() * MOCK_NAMES.length);
                const userName = MOCK_NAMES[randomIndex];
                const comment = MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)];
                const rating = Math.floor(Math.random() * 3) + 2; // 2 to 5 stars

                const newReview = await Review.create({
                    userId: `user_mock_${Math.random().toString(36).substr(2, 9)}`,
                    clerkUserId: `user_mock_${Math.random().toString(36).substr(2, 9)}`,
                    userName,
                    location: MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)],
                    tripType: TRIP_TYPES[Math.floor(Math.random() * TRIP_TYPES.length)],
                    tripDuration: `${Math.floor(Math.random() * 7) + 3} Days`,
                    travelers: `${Math.floor(Math.random() * 4) + 1} Adults`,
                    rating,
                    comment,
                    isVerified: Math.random() > 0.4
                });

                const log = await ActivityLog.create({
                    clerkUserId: newReview.userId,
                    activityType: 'comment_added',
                    targetId: newReview._id.toString(),
                    details: `Left verified traveler review: "${comment.substring(0, 30)}..."`,
                    username: userName.toLowerCase().replace(/ /g, '_')
                });

                broadcastRealtimeEvent('activity:new', log);
                broadcastRealtimeEvent('simulator:review:new', newReview);

                logger.info(`[SIMULATOR] Ingested mock testimonial from @${userName}`);
            }

        } catch (err: any) {
            logger.error(`[SIMULATOR] Error generating mock event: ${err.message}`);
        }
    }, intervalMs);
};

export const stopSimulator = () => {
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
        logger.info('[TRAFFIC SIMULATOR] Ingestion loop terminated.');
    }
};

export const isSimulatorRunning = (): boolean => {
    return simulationInterval !== null;
};
