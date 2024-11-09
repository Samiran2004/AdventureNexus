import express, {Router} from 'express';
import createNewUser, {
    CustomRequestRegisterController,
    RequestBodyRegisterController
} from '../controller/usercontroller/registerController';
import upload from '../middlewares/multer';
import authTokenMiddleware from '../middlewares/authTokenMiddleware';
import loginuser from "../controller/usercontroller/loginController";
import userProfile, {CustomRequestUserProfileController} from "../controller/usercontroller/userProfileController";
import userDelete from "../controller/usercontroller/userProfileDeleteController";
import updateProfile, {CustomRequestUpdateProfile} from "../controller/usercontroller/updateProfileController";
import updateProfilePicture, {
    CustomRequestUpdateProfilePicture
} from "../controller/usercontroller/updateProfilePictureController";

const route: Router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - fullname
 *              - email
 *              - password
 *              - phonenumber
 *              - gender
 *              - country
 *          properties:
 *              fullname:
 *                  type: string
 *                  description: User's full name
 *              email:
 *                  type: string
 *                  description: User's email address
 *              password:
 *                  type: string
 *                  description: User's password
 *              phonenumber:
 *                  type: string
 *                  description: User's phone number
 *              gender:
 *                  type: string
 *                  enum: [male, female, other]
 *                  description: User's gender
 *              preference:
 *                  type: array
 *                  items:
 *                      type: string
 *                  description: User's preference
 *      UserResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: string
 *                  description: The status of the response
 *              message:
 *                  type: string
 *                  description: A message describing the result
 */

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */

// Create new user... Path: /api/v1/user/register
route.post('/register', upload.single("profileimage"), (req, res, next) => {
    createNewUser(req as CustomRequestRegisterController, res, next);
});

// Login a User... Path: /api/v1/user/login
route.post('/login', (req, res, next) => {
    loginuser(req, res, next);
});

// Get user profile details... Path: /api/v1/user/profile
route.get('/profile', authTokenMiddleware, (req, res, next) => {
    userProfile(req as CustomRequestUserProfileController, res, next);
});

// Delete user... Path: /api/v1/user/delete
route.delete('/delete', authTokenMiddleware, (req, res, next) => {
    userDelete(req, res, next);
});

// Update user... Path: /api/v1/user/update
route.patch('/update', authTokenMiddleware, upload.single("profileimage"), (req, res, next) => {
    updateProfile(req as CustomRequestUpdateProfile, res, next);
});

// Update profile picture... Path: /api/v1/user/update/profilepicture
route.patch('/update/profilepicture', authTokenMiddleware, upload.single("profileimage"), (req, res, next) => {
    updateProfilePicture(req as CustomRequestUpdateProfilePicture, res, next);
});

export default route;
