module.exports = async function loginuser(req, res) {
    try {
        const { username, email, password } = req.body;
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