const { Router } = require('express');

const UsersController = require('./controllers/UsersController');

const routes = Router();

const usersController = new UsersController()

routes.get('/users', usersController.list);
routes.post('/users', usersController.create);
routes.put('/users/:id', usersController.update);
routes.get('/users/:id', usersController.show);
routes.delete('/users/:id', usersController.delete);

module.exports = routes;