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

// Configure env variables...
require('dotenv').config();

//Database connecton...
mongoose.connect(process.env.DB_URI).then(
    () => {
        figlet("Database  connected", (err, data) => err ? console.log("Figlet error...") : console.log(data))
    }
).catch(
    () => {
        figlet("Database connection error", (err, data) => err ? console.log("Figlet error") : console.log(data))
    }
)

// CORS...
app.use(cors());

// Express middlewares...
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
        ? figlet(`Server connection error`, (err, data) => {
            err ? console.log("Figlet error") : console.log(data);
        })
        : figlet(`Server connected \n PORT:  ${process.env.PORT}`, (err, data) => {
            err ? console.log("Figlet error...") : console.log(data);
        })
);