'use strict';

//Setting up route
angular.module('programas').config(['$stateProvider',
	function($stateProvider) {
		// programas state routing
		$stateProvider.
		state('listProgramas', {
			url: '/programas',
			templateUrl: 'modules/programas/client/views/list-programas.client.view.html'
		}).
		state('createProgramas', {
			url: '/programas/create',
			templateUrl: 'modules/programas/client/views/create-programa.client.view.html'
		}).
		state('addBackdrop', {
			url: '/programas/addBackdrop/:programaId',
			templateUrl: 'modules/programas/client/views/addBackdrop-programa.client.view.html'
		}).
		state('viewProgramas', {
			url: '/programas/:programaId',
			templateUrl: 'modules/programas/client/views/view-programa.client.view.html'
		}).
		state('editProgramas', {
			url: '/programas/:programaId/edit',
			templateUrl: 'modules/programas/client/views/edit-programa.client.view.html'
		}).
		state('listDestaqueTopo', {
			url: '/destaques/listDestaqueTopo',
			templateUrl: 'modules/programas/client/views/list-programasDestaqueTopo.client.view.html'
		}).
		state('listDestaqueMeio', {
			url: '/destaques/listDestaqueMeio',
			templateUrl: 'modules/programas/client/views/list-programasDestaqueMeio.client.view.html'
		});
	}
]);

