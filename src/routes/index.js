//That's the main routes file. Import all the routes down the line 8.
const { Router } = require('express');

const usersRouter = require('./users.routes.js');
const moviesRouter = require('./movies.routes.js');
const tagsRouter = require('./tags.routes.js');

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/movies', moviesRouter);
routes.use('/tags', tagsRouter);

module.exports = routes;
