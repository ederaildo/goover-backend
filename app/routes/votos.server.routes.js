'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var votos = require('../../app/controllers/votos.server.controller');

	// Votos Routes
	app.route('/votos')
		.get(votos.list)
		.post(users.requiresLogin, votos.create);

	app.route('/votos/:votoId')
		.get(votos.read)
		.put(users.requiresLogin, votos.hasAuthorization, votos.update)
		.delete(users.requiresLogin, votos.hasAuthorization, votos.delete);

	// Finish by binding the Voto middleware
	app.param('votoId', votos.votoByID);
};
