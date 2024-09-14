module.exports = async function loginuser(req, res) {
    try {
<<<<<<< HEAD
        //Fetch all user data from req.body...
        const { username, email, password } = req.body;
        // Check if all required fields are provided in the request body
        if(!username || !email || !password){
=======
        //Fetch the user data from req.body...
        const { username, email, password } = req.body;
        //Check all required fields are provided or not..
        if(!username || !email || !email){
>>>>>>> f164a30a92a9d8c0b3f7cf9ed20303f3f2484fa8
            res.status(400).send({
                status: 'Failed',
                message: "All fields are required."
            });
<<<<<<< HEAD
        }else{
            res.status(200).send({
                status: 'Success',
                data:{
                    username, email, password
                }
            })
        }
=======
        }
        res.status(200).send({
            status: 'Success',
            data:{
                username, email, password
            }
        })
>>>>>>> f164a30a92a9d8c0b3f7cf9ed20303f3f2484fa8
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: "Internal Server Error...",
            error
        });
    };
};