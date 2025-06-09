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
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const recommendationRoutes_1 = __importDefault(require("./routes/recommendationRoutes"));
const planningRoute_1 = __importDefault(require("./routes/planningRoute"));
const sanitization_1 = __importDefault(require("./middlewares/sanitization"));
const client_1 = __importDefault(require("./redis/client"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const config_1 = require("./config/config");
const path_1 = __importDefault(require("path"));
const connectDb_1 = __importDefault(require("./Database/connectDb"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(async () => {
    await (0, connectDb_1.default)(process.env.DB_URI);
})();
client_1.default.on('connect', () => {
    (0, figlet_1.default)('R e d i s   c o n n e c t e d', (err, data) => err ? console.log('Figlet error...') : console.log(data));
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions_1.swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use(sanitization_1.default);
app.get('/isWork', (req, res) => {
    res.status(200).send({
        status: 'success',
        isWorking: true,
    });
});
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/recommendations', recommendationRoutes_1.default);
app.use('/api/v1/plans', planningRoute_1.default);
app.use(globalErrorHandler_1.default);
app.listen(config_1.config.port, (err) => err
    ? (0, figlet_1.default)(`S e r v e r  c o n n e c t i o n  e r r o r`, (err, data) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        err ? console.log('Figlet error') : console.log(data);
    })
    : (0, figlet_1.default)(`S e r v e r  c o n n e c t e d \n P O R T :  ${config_1.config.port}`, (err, data) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        err ? console.log('Figlet error...') : console.log(data);
    }));
