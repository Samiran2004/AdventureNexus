module.exports = async function loginuser(req, res) {
    try {
        //Fetch the user data from req.body...
        const { username, email, password } = req.body;
        //Check all required fields are provided or not..
        if(!username || !email || !email){
            res.status(400).send({
                status: 'Failed',
                message: "All fields are required."
            });
        }
        res.status(200).send({
            status: 'Success',
            data:{
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