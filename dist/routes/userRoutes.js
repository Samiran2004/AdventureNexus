"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = __importDefault(require("../controller/usercontroller/registerController"));
const multer_1 = require("../middlewares/multer");
const authTokenMiddleware_1 = __importDefault(require("../middlewares/authTokenMiddleware"));
const loginController_1 = __importDefault(require("../controller/usercontroller/loginController"));
const userProfileController_1 = __importDefault(require("../controller/usercontroller/userProfileController"));
const userProfileDeleteController_1 = __importDefault(require("../controller/usercontroller/userProfileDeleteController"));
const updateProfileController_1 = __importDefault(require("../controller/usercontroller/updateProfileController"));
const rateLimiter_1 = __importDefault(require("../utils/rateLimiter"));
const route = express_1.default.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Users:
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
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
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
route.post('/register', rateLimiter_1.default, multer_1.upload.single('profileimage'), (req, res, next) => {
    (0, registerController_1.default)(req, res, next);
});
// routes/userRoutes.ts
/**
 * @swagger
 * /api/users/v1/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error
 *       401:
 *         description: Incorrect Password
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// Login a User... Path: /api/v1/user/login
route.post('/login', rateLimiter_1.default, (req, res, next) => {
    (0, loginController_1.default)(req, res, next);
});
/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get the profile of the authenticated user
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for user authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 userData:
 *                   type: object
 *                   properties:
 *                     fullname:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     phonenumber:
 *                       type: string
 *                       example: +1234567890
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     gender:
 *                       type: string
 *                       example: male
 *                     profilepicture:
 *                       type: string
 *                       example: https://example.com/profile.jpg
 *                     preference:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [ "preference1", "preference2" ]
 *                     country:
 *                       type: string
 *                       example: USA
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// Get user profile details... Path: /api/v1/user/profile
route.get('/profile', authTokenMiddleware_1.default, (req, res, next) => {
    (0, userProfileController_1.default)(req, res, next);
});
/**
 * @swagger
 * /api/v1/users/delete:
 *   delete:
 *     summary: Delete the authenticated user
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for user authentication
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: User deleted.
 *       404:
 *         description: Not a valid user
 *       500:
 *         description: Internal server error
 */
// Delete user... Path: /api/v1/user/delete
route.delete('/delete', authTokenMiddleware_1.default, (req, res, next) => {
    (0, userProfileDeleteController_1.default)(req, res, next);
});
/**
 * @swagger
 * /api/v1/users/update:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for user authentication
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               preference:
 *                 type: array
 *                 items:
 *                   type: string
 *               country:
 *                 type: string
 *               password:
 *                 type: string
 *               profilepicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: User updated.
 *                 userData:
 *                   type: object
 *                   properties:
 *                     fullname:
 *                       type: string
 *                       example: John Doe
 *                     username:
 *                       type: string
 *                       example: johndoe123
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     phonenumber:
 *                       type: string
 *                       example: +1234567890
 *                     gender:
 *                       type: string
 *                       example: male
 *                     preference:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["preference1", "preference2"]
 *                     country:
 *                       type: string
 *                       example: USA
 *                     profilepicture:
 *                       type: string
 *                       example: https://example.com/profile.jpg
 *                     _id:
 *                       type: string
 *                       example: 603e2a7e5c146b001c5e4ef5
 *       400:
 *         description: Please provide at least one field to update
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// Update user... Path: /api/v1/user/update
route.put('/update', authTokenMiddleware_1.default, multer_1.upload.single('profileimage'), (req, res, next) => {
    (0, updateProfileController_1.default)(req, res, next);
});
exports.default = route;
