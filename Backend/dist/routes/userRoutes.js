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
route.post('/register', rateLimiter_1.default, multer_1.upload.single('profileimage'), (req, res, next) => {
    (0, registerController_1.default)(req, res, next);
});
route.post('/login', rateLimiter_1.default, (req, res, next) => {
    (0, loginController_1.default)(req, res, next);
});
route.get('/profile', authTokenMiddleware_1.default, (req, res, next) => {
    (0, userProfileController_1.default)(req, res, next);
});
route.delete('/delete', authTokenMiddleware_1.default, (req, res, next) => {
    (0, userProfileDeleteController_1.default)(req, res, next);
});
route.put('/update', authTokenMiddleware_1.default, multer_1.upload.single('profileimage'), (req, res, next) => {
    (0, updateProfileController_1.default)(req, res, next);
});
exports.default = route;
