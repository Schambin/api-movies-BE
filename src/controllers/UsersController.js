//All the user actions like get, post, put n delete.
class UsersController {
    create(req, res) {
        const { username, email, password } = req.body;

        res.send(`${username} \n ${email} \n ${password}`);
    }
}

module.exports = UsersController;