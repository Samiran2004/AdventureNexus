module.exports = async function loginuser(req, res) {
    try {
        //Fetch all user data from req.body...
        const { username, email, password } = req.body;
        // Check if all required fields are provided in the request body
        if(!username || !email || !password){
            res.status(400).send({
                status: 'Failed',
                message: "All fields are required."
            });
        }else{
            res.status(200).send({
                status: 'Success',
                data:{
                    username, email, password
                }
            })
        }
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error...",
            error
        });
    };
};