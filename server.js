const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerOptions = require('./utils/swaggerOptions');
const figlet = require('figlet');
const mongoose = require('mongoose');
const userroute = require('./routes/userRoutes');
const sanitizeInput = require('./middlewares/sanitization');
const cookieParser = require('cookie-parser');

// Configure env variables...
require('dotenv').config();

//Database connecton...
mongoose.connect(process.env.DB_URI).then(
    () => {
        figlet("D a t a b a s e   c o n n e c t e d", (err, data) => err ? console.log("Figlet error...") : console.log(data))
    }
).catch(
    () => {
        figlet("D a t a b a s e  c o n n e c t i o n  e r r o r", (err, data) => err ? console.log("Figlet error") : console.log(data))
    }
)

// CORS...
app.use(cors());

// Express middlewares...
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(morgan('dev'));

app.use(
    helmet({
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
    })
);

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Configure Helmet...
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", 'example.com'],
            },
        },
        referrerPolicy: {
            policy: 'no-referrer',
        },
        xssFilter: true,
        noSniff: true,
    })
);

// Configure Sanitization...
app.use(sanitizeInput);

// Is working route...
/**
 * @swagger
 * /isWork:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: Check the server is working or not
 */
app.get('/isWork', (req, res) => {
    res.status(200).send({
        status: 'success',
        isWorking: true,
    });
});

//User route...
app.use('/api/v1/user', userroute);

// Connection with server...
app.listen(process.env.PORT, (err) =>
    err
        ? figlet(`S e r v e r  c o n n e c t i o n  e r r o r`, (err, data) => {
            err ? console.log("Figlet error") : console.log(data);
        })
        : figlet(`S e r v e r  c o n n e c t e d \n P O R T :  ${process.env.PORT}`, (err, data) => {
            err ? console.log("Figlet error...") : console.log(data);
        })
);