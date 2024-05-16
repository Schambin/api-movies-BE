//All the user actions like get, post, put n delete.
const bcrypt = require('bcryptjs');
const { format } = require('date-fns');
const AppError = require('../utils/AppError');
const sqliteConnection = require('../database/sqlite');

class UsersController {
    async create(req, res) {
        const { name, email, password } = req.body;

        if (!name) {
            throw new AppError('Invalid name')
        }

        const database = await sqliteConnection();

        const checkIfUserExists = await database.get(`SELECT * FROM users WHERE email = '${email}'`)

        if (checkIfUserExists) {
            throw new AppError('Este email já está em uso')
        }

        const hashedPassword = await hash(password, 8);

        await database.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hashedPassword]);

        return res.status(201).json();
    }

    async update(req, res) {
        const { name, email, password, oldPassword, newPassword } = req.body;
        const { id } = req.params;
        const database = await sqliteConnection();
        const formatedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');


        const user = await database.get(`SELECT * FROM users WHERE id = (?)`, [id]);
        if (!user) {
            throw new AppError('Usuário não encontrando ou inexistente');
        }


        const newEmail = await database.get(`SELECT * FROM users WHERE email = (?)`, [email]);
        if (newEmail && newEmail.id !== user.id) {
            throw new AppError('Este email já está em uso');
        }

        if (oldPassword) {
            const passwordMatches = await bcrypt.compare(oldPassword, user.password)
            if (!passwordMatches) {
                throw new AppError('Senha antiga está incorreta');
            }

            if (newPassword) {
                const hashedPassword = await bcrypt.hash(newPassword, 8);
                user.password = hashedPassword;
            }
        }

        user.name = name;
        user.email = email;

        await database.run(`
            UPDATE users SET
            name = ?, email = ?, password =?, updated_at = ? WHERE id = ?`,
            [user.name, user.email, user.password, formatedDate, id]
        );

        return res.json('Alterações realizadas com sucesso!');
    }
}

module.exports = UsersController;