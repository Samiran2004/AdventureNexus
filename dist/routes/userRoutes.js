"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = __importDefault(require("../controller/usercontroller/registerController"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const authTokenMiddleware_1 = __importDefault(require("../middlewares/authTokenMiddleware"));
const route = express_1.default.Router();
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
route.post('/register', multer_1.default.single("profileimage"), registerController_1.default);
// Login a User... Path: /api/v1/user/login
route.post('/login', require('../controller/usercontroller/loginController'));
// Get user profile details... Path: /api/v1/user/profile
route.get('/profile', authTokenMiddleware_1.default, require('../controller/usercontroller/userProfileController'));
// Delete user... Path: /api/v1/user/delete
route.delete('/delete', authTokenMiddleware_1.default, require('../controller/usercontroller/userProfileDeleteController'));
// Update user... Path: /api/v1/user/update
route.patch('/update', authTokenMiddleware_1.default, multer_1.default.single("profileimage"), require('../controller/usercontroller/updateProfileController'));
// Update profile picture... Path: /api/v1/user/update/profilepicture
route.patch('/update/profilepicture', authTokenMiddleware_1.default, multer_1.default.single("profileimage"), require('../controller/usercontroller/updateProfilePictureController'));
exports.default = route;
