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
dotenv_1.default.config();
const config_1 = require("./config/config");
const connection_1 = __importDefault(require("./database/connection"));
const client_1 = __importDefault(require("./redis/client"));
require("./jobs/dailyTips.job");
require("./jobs/runner.job");
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const sanitization_1 = __importDefault(require("./middlewares/sanitization"));
const express_2 = require("@clerk/express");
const ClerkWebhook_1 = __importDefault(require("./controllers/ClerkWebhook"));
const subscribeDailyMail_controller_1 = __importDefault(require("./controllers/newsSubscriptionController/subscribeDailyMail.controller"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const planning_routes_1 = __importDefault(require("./routes/planning.routes"));
const hotels_routes_1 = __importDefault(require("./routes/hotels.routes"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerOptions_1 = require("./utils/swaggerOptions");
const app = (0, express_1.default)();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.default)(process.env.DB_URI);
}))();
client_1.default.on('connect', () => {
    (0, figlet_1.default)('R e d i s   c o n n e c t e d', (err, data) => err ? console.log('Figlet error...') : console.log(data));
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
app.use((0, morgan_1.default)('dev'));
app.use((0, express_2.clerkMiddleware)());
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions_1.swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use(sanitization_1.default);
app.use('/api/clerk', ClerkWebhook_1.default);
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/plans', planning_routes_1.default);
app.use('/api/v1/hotels', hotels_routes_1.default);
app.post('/api/v1/mail/subscribe', subscribeDailyMail_controller_1.default);
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
app.use(globalErrorHandler_1.default);
exports.default = app;
app.listen(config_1.config.port, (err) => err
    ? (0, figlet_1.default)(`S e r v e r  c o n n e c t i o n  e r r o r`, (err, data) => {
        err ? console.log('Figlet error') : console.log(data);
    })
    : (0, figlet_1.default)(`S e r v e r  c o n n e c t e d \n P O R T :  ${config_1.config.port}`, (err, data) => {
        err ? console.log('Figlet error...') : console.log(data);
    }));
