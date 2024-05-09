//Routes for users
const { Router } = require('express');

const usersRoutes = Router();

usersRoutes.post('/', (req, res) => {
    const { username, email, password } = req.body;

    res.send(`${username} \n ${email} \n ${password}`);
});

module.exports = usersRoutes;