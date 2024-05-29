//Routes for users
const { Router } = require('express');

const usersRoutes = Router();

const UsersController = require('../controllers/UsersController')

/*
*  MiddleWare Check
*
*  checkIfIsAdmin = (req, res, next) => {
*   if (req.body.isAdmin === true) {
*       return next();
*   }
*      return res.status(401).json({ error: 'Usuário Não Autorizado' });
*   }
*/

const usersController = new UsersController();

usersRoutes.post('/', usersController.create);
usersRoutes.put('/:id', usersController.update);

module.exports = usersRoutes;