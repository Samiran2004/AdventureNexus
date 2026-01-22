"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const figlet_1 = __importDefault(require("figlet"));
const http_1 = __importDefault(require("http"));
dotenv_1.default.config();
const config_1 = require("./shared/config/config");
const connection_1 = __importDefault(require("./shared/database/connection"));
const client_1 = __importDefault(require("./shared/redis/client"));
require("./jobs/dailyTips.job");
require("./jobs/runner.job");
const userModel_1 = __importDefault(require("./shared/database/models/userModel"));
const globalErrorHandler_1 = __importDefault(require("./shared/middleware/globalErrorHandler"));
const sanitization_1 = __importDefault(require("./shared/middleware/sanitization"));
const express_2 = require("@clerk/express");
const maintenanceMiddleware_1 = require("./shared/middleware/maintenanceMiddleware");
const telemetryMiddleware_1 = require("./shared/middleware/telemetryMiddleware");
const ClerkWebhook_1 = __importDefault(require("./modules/auth/controllers/ClerkWebhook"));
const subscribeDailyMail_controller_1 = __importDefault(require("./modules/newsletter/controllers/subscribeDailyMail.controller"));
const user_routes_1 = __importDefault(require("./modules/users/routes/user.routes"));
const planning_routes_1 = __importDefault(require("./modules/planning/routes/planning.routes"));
const hotels_routes_1 = __importDefault(require("./modules/hotels/routes/hotels.routes"));
const review_routes_1 = __importDefault(require("./modules/reviews/routes/review.routes"));
const likedPlans_routes_1 = __importDefault(require("./modules/planning/routes/likedPlans.routes"));
const booking_routes_1 = __importDefault(require("./modules/bookings/routes/booking.routes"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerOptions_1 = require("./shared/utils/swaggerOptions");
const logger_1 = __importDefault(require("./shared/utils/logger"));
const socket_1 = require("./shared/socket/socket");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, socket_1.initSocket)(server);
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.default)(process.env.DB_URI);
}))();
client_1.default.on('connect', () => {
    (0, figlet_1.default)('R e d i s   c o n n e c t e d', (err, data) => err ? logger_1.default.error('Figlet error...') : logger_1.default.info(data));
});
app.use(express_1.default.static('public'));
app.use(express_1.default.static(path_1.default.resolve('./Public')));
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
        },
    },
    referrerPolicy: {
        policy: 'no-referrer',
    },
    xssFilter: true,
    noSniff: true,
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
const morganMiddleware = (0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
        write: (message) => logger_1.default.http(message.trim()),
    },
});
app.use(morganMiddleware);
app.use(telemetryMiddleware_1.telemetryMiddleware);
app.use((0, express_2.clerkMiddleware)());
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions_1.swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use(sanitization_1.default);
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if ((_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId) {
            userModel_1.default.updateOne({ clerkUserId: req.auth.userId }, { lastActive: new Date() }).exec();
        }
    }
    catch (error) {
        logger_1.default.warn('Failed to update user activity');
    }
    next();
}));
app.use('/api/clerk', ClerkWebhook_1.default);
app.use(maintenanceMiddleware_1.checkMaintenance);
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/plans', planning_routes_1.default);
app.use('/api/v1/hotels', hotels_routes_1.default);
app.use('/api/v1/reviews', review_routes_1.default);
app.use('/api/v1/bookings', booking_routes_1.default);
app.use('/api/v1/liked-plans', likedPlans_routes_1.default);
const triggerDailyTips_controller_1 = __importDefault(require("./modules/newsletter/controllers/triggerDailyTips.controller"));
app.post('/api/v1/mail/subscribe', subscribeDailyMail_controller_1.default);
app.post('/api/v1/mail/trigger-daily-tips', triggerDailyTips_controller_1.default);
const admin_routes_1 = __importDefault(require("./modules/admin/routes/admin.routes"));
app.use('/api/v1/admin', admin_routes_1.default);
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
app.use(globalErrorHandler_1.default);
exports.default = app;
server.listen(config_1.config.port, () => {
    (0, figlet_1.default)(`S e r v e r  c o n n e c t e d \n P O R T :  ${config_1.config.port}`, (err, data) => {
        err ? logger_1.default.error('Figlet error...') : logger_1.default.info(data);
    });
});
