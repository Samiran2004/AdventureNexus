const userDataValidation = require('../utils/joiLoginValidation');

module.exports = async function loginuser(req, res) {
    try {
        //Fetch all user data from req.body...
        const { username, email, password } = req.body;
        // Check if all required fields are provided in the request body
        if (!username || !email || !password) {
            //Fetch the user data from req.body...
            const { username, email, password } = req.body;
            //Check all required fields are provided or not..
            if (!username || !email || !email) {
                res.status(400).send({
                    status: 'Failed',
                    message: "All fields are required."
                });
            } else {
                //Validate user data using JOI...
                const { error } = userDataValidation.validate(req.body);
                if (error) {
                    res.status(400).send({
                        status: 'Failed',
                        message: error.details[0].message
                    });
                }else{
                    res.status(200).send({
                        status: 'Success',
                        message: "User Logged."
                    })
                }
            }
        }
        res.status(200).send({
            status: 'Success',
            data: {
                username, email, password
            }
        })
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error...",
            error
        });
    };
};