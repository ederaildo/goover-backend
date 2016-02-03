'use strict';

module.exports = function(app) {
	var users = require('../../../users/server/controllers/users.server.controller');
	var categorias = require('../controllers/categorias.server.controller');

	// Categorias Routes
	app.route('/categorias')
		.get(categorias.list)
		.post(users.requiresLogin, categorias.create);

	app.route('/categorias/:categoriaId')
		.get(categorias.read)
		.put(users.requiresLogin, categorias.hasAuthorization, categorias.update)
		.delete(users.requiresLogin, categorias.hasAuthorization, categorias.delete);

	// Finish by binding the Categoria middleware
	app.param('categoriaId', categorias.categoriaByID);
};
