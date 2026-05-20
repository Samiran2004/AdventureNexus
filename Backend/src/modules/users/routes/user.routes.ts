import express, { Router } from 'express';
import userProfile, {
    CustomRequestUserProfileController,
} from '../controllers/userProfileController';
import { updateProfile } from '../controllers/updateProfileController';
import { protect } from '../../../shared/middleware/authClerkTokenMiddleware';
import { upload } from '../../../shared/middleware/multer';
import {
    getUserDashboardProfile,
    getUserDashboardPosts,
    getUserDashboardExperiences,
    getUserDashboardComments,
    getUserDashboardLikes,
    getUserDashboardGroups
} from '../controllers/profileDashboardController';

const route: Router = express.Router();

// Current logged in user profile (Clerk session sync)
route.get('/profile', protect, (req, res, next) => {
    userProfile(req as CustomRequestUserProfileController, res, next);
});

// Update profile
route.patch('/profile', protect, upload.single('image'), updateProfile);
route.put('/update', protect, upload.single('image'), updateProfile);

// Social control center and dashboard content routes
route.get('/:clerkUserId/profile', protect, getUserDashboardProfile);
route.get('/:clerkUserId/posts', protect, getUserDashboardPosts);
route.get('/:clerkUserId/experiences', protect, getUserDashboardExperiences);
route.get('/:clerkUserId/comments', protect, getUserDashboardComments);
route.get('/:clerkUserId/likes', protect, getUserDashboardLikes);
route.get('/:clerkUserId/groups', protect, getUserDashboardGroups);

export default route;
