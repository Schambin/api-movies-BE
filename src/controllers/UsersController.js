//All the user actions like get, post, put n delete.
const AppError = require('../utils/AppError');
const sqliteConnection = require('../database/sqlite');

class UsersController {
    async create(req, res) {
        const { username, email, password } = req.body;

        if (!username) {
            throw new AppError('Invalid Username')
        }

        const database = await sqliteConnection();

        const checkIfUserExists = await database.get(`SELECT * FROM users WHERE email = '${email}'`)

        if (checkIfUserExists) {
            throw new AppError('Este email já está em uso')
        }

        return res.status(201).json();
    }

    update(req, res) {

    }

    delete(req, res) {

    }


}

module.exports = UsersController;