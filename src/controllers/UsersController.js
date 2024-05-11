//All the user actions like get, post, put n delete.
const AppError = require('../utils/AppError');

class UsersController {
    create(req, res) {
        const { username, email, password } = req.body;

        if (!username) {
            throw new AppError('Invalid Username')
        }

        res.send(`${username} \n ${email} \n ${password}`);
    }
}

module.exports = UsersController;