import express, { Router } from 'express';
import userProfile, {
    CustomRequestUserProfileController,
} from '../controller/usercontroller/userProfileController';
import { protect } from '../middlewares/authClerkTokenMiddleware';

const route: Router = express.Router();


// Create new user... Path: /api/v1/user/register
// route.post(
//     '/register',
//     limiter,
//     upload.single('profileimage'),
//     (req, res, next: NextFunction) => {
//         createNewUser(req as CustomRequestRegisterController, res, next);
//     }
// );

// routes/userRoutes.ts

// Login a User... Path: /api/v1/user/login
// route.post('/login', limiter, (req, res, next) => {
//     loginuser(req, res, next);
// });

// Get user profile details... Path: /api/v1/users/profile
route.get('/profile', protect, (req, res, next) => {
    userProfile(req as CustomRequestUserProfileController, res, next);
});

export default route;
