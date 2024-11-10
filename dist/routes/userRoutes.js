"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerController_1 = __importDefault(require("../controller/usercontroller/registerController"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const authTokenMiddleware_1 = __importDefault(require("../middlewares/authTokenMiddleware"));
const loginController_1 = __importDefault(require("../controller/usercontroller/loginController"));
const userProfileController_1 = __importDefault(require("../controller/usercontroller/userProfileController"));
const userProfileDeleteController_1 = __importDefault(require("../controller/usercontroller/userProfileDeleteController"));
const updateProfileController_1 = __importDefault(require("../controller/usercontroller/updateProfileController"));
const updateProfilePictureController_1 = __importDefault(require("../controller/usercontroller/updateProfilePictureController"));
const rateLimiter_1 = __importDefault(require("../utils/rateLimiter"));
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
route.post('/register', rateLimiter_1.default, multer_1.default.single("profileimage"), (req, res, next) => {
    (0, registerController_1.default)(req, res, next);
});
// Login a User... Path: /api/v1/user/login
route.post('/login', rateLimiter_1.default, (req, res, next) => {
    (0, loginController_1.default)(req, res, next);
});
// Get user profile details... Path: /api/v1/user/profile
route.get('/profile', authTokenMiddleware_1.default, (req, res, next) => {
    (0, userProfileController_1.default)(req, res, next);
});
// Delete user... Path: /api/v1/user/delete
route.delete('/delete', authTokenMiddleware_1.default, (req, res, next) => {
    (0, userProfileDeleteController_1.default)(req, res, next);
});
// Update user... Path: /api/v1/user/update
route.patch('/update', authTokenMiddleware_1.default, multer_1.default.single("profileimage"), (req, res, next) => {
    (0, updateProfileController_1.default)(req, res, next);
});
// Update profile picture... Path: /api/v1/user/update/profilepicture
route.patch('/update/profilepicture', authTokenMiddleware_1.default, multer_1.default.single("profileimage"), (req, res, next) => {
    (0, updateProfilePictureController_1.default)(req, res, next);
});
exports.default = route;
