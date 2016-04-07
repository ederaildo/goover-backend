'use strict';

//Setting up route
angular.module('votos').config(['$stateProvider',
	function($stateProvider) {
		// Votos state routing
		$stateProvider.
		state('listVotos', {
			url: '/votos',
			templateUrl: 'modules/votos/views/list-votos.client.view.html'
		}).
		state('createVoto', {
			url: '/votos/create',
			templateUrl: 'modules/votos/views/create-voto.client.view.html'
		}).
		state('viewVoto', {
			url: '/votos/:votoId',
			templateUrl: 'modules/votos/views/view-voto.client.view.html'
		}).
		state('editVoto', {
			url: '/votos/:votoId/edit',
			templateUrl: 'modules/votos/views/edit-voto.client.view.html'
		});
	}
]);