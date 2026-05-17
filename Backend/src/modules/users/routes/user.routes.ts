import express, { Router } from 'express';
import userProfile, {
    CustomRequestUserProfileController,
} from '../controllers/userProfileController';
import { updateProfile } from '../controllers/updateProfileController';
import { protect } from '../../../shared/middleware/authClerkTokenMiddleware';
import { upload } from '../../../shared/middleware/multer';

const route: Router = express.Router();

/**
 * @route GET /api/v1/users/profile
 * @desc Get the current user's profile information.
 * @access Private (Protected by Clerk Metadata)
 */
route.get('/profile', protect, (req, res, next) => {
    userProfile(req as CustomRequestUserProfileController, res, next);
});

/**
 * @route PATCH /api/v1/users/profile
 * @desc Update the current user's profile information, optionally uploading a cover image.
 * @access Private
 */
route.patch('/profile', protect, upload.single('image'), updateProfile);

export default route;
