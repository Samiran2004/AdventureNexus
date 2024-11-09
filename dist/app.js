"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions_1 = require("./utils/swaggerOptions");
const figlet_1 = __importDefault(require("figlet"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const recommendationRoutes_1 = __importDefault(require("./routes/recommendationRoutes"));
const planningRoute_1 = __importDefault(require("./routes/planningRoute"));
const sanitization_1 = __importDefault(require("./middlewares/sanitization"));
const client_1 = __importDefault(require("./redis/client"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
// Configure env variables...
dotenv_1.default.config();
// Initialize express app
const app = (0, express_1.default)();
// Database connection...
mongoose_1.default.connect(process.env.DB_URI).then(() => {
    (0, figlet_1.default)("D a t a b a s e   c o n n e c t e d", (err, data) => err ? console.log("Figlet error...") : console.log(data));
}).catch(() => {
    (0, figlet_1.default)("D a t a b a s e  c o n n e c t i o n  e r r o r", (err, data) => err ? console.log("Figlet error") : console.log(data));
});
// Redis connection...
client_1.default.on("connect", () => {
    console.log("Redis connected...");
});
// CORS...
app.use((0, cors_1.default)());
// Express middlewares...
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
// Helmet for security headers...
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions_1.swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Configure Sanitization...
app.use(sanitization_1.default);
// Check if server is working...
/**
 * @swagger
 * /isWork:
 *   get:
 *     summary: Check if the server is working
 *     responses:
 *       200:
 *         description: Server status check
 */
app.get('/isWork', (req, res) => {
    res.status(200).send({
        status: 'success',
        isWorking: true,
    });
});
// User route...
app.use('/api/v1/user', userRoutes_1.default);
// Recommendation route...
app.use('/api/v1/recommendation', recommendationRoutes_1.default);
// Planning route...
app.use('/api/v1/planning', planningRoute_1.default);
app.use(globalErrorHandler_1.default);
// Server connection...
app.listen(process.env.PORT, (err) => err
    ? (0, figlet_1.default)(`S e r v e r  c o n n e c t i o n  e r r o r`, (err, data) => {
        err ? console.log("Figlet error") : console.log(data);
    })
    : (0, figlet_1.default)(`S e r v e r  c o n n e c t e d \n P O R T :  ${process.env.PORT}`, (err, data) => {
        err ? console.log("Figlet error...") : console.log(data);
    }));
