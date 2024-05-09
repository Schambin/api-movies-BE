const { Router } = require('express');

const usersRoutes = Router();

usersRoutes.get('/', (req, res) => {
    res.send(`Rota GET running on localhost:${PORT}`);
});

usersRoutes.post('/users', (req, res) => {
    const { username, password } = req.body;

    res.send(`${username} \n ${password}`)
});

module.exports = usersRoutes;