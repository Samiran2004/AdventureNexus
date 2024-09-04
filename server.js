const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

//Configure env variables...
require('dotenv').config();

//CORS...
app.use(cors());

//Express middlewares...
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));

//Configure Helmet...
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", 'example.com'],
            }
        },
        referrerPolicy: {
            policy: 'no-referrer'
        },
        xssFilter: true,
        noSniff: true
    }));

//Is working route...
app.get('/isWork', (req, res) => {
    res.status(200).send({
        status: "success",
        isWorking: true
    })
})

//Connection with server...
app.listen(process.env.PORT, (err) => err ? console.log(`Server connection error ${err}...`) : console.log(`Server connected on port: ${process.env.PORT}`));