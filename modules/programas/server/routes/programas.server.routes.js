'use strict';

module.exports = function(app) {
	var users = require('../../../users/server/controllers/users.server.controller');
	var programas = require('../controllers/programas.server.controller');

	// Programas Routes
	app.route('/programas')
		.get(programas.list)
		.post(users.requiresLogin, programas.create);
	
	app.route('/destaques/listDestaqueTopo')
	    .get(programas.listDestaqueTopo);

	app.route('/destaques/listDestaqueMeio')
		.get(programas.listDestaqueMeio);
	
	app.route('/homeGooverApp')
    .get(programas.getHomeGooverApp);
	
	app.route('/programas/:programaId')
		.get(programas.read)
		.put(users.requiresLogin, programas.hasAuthorization, programas.update)
		.delete(users.requiresLogin, programas.hasAuthorization, programas.delete);

	app.route('/programas/backdrop/').post(programas.uploadBackdrop);
	
	// Finish by binding the Programa middleware
	app.param('programaId', programas.programaByID);
	

};
