'use strict';

//Setting up route
angular.module('categorias').config(['$stateProvider',
	function($stateProvider) {
		// Categorias state routing
		$stateProvider.
		state('categorias', {
			abstract: true,
			url: '/categorias',
		    template: '<ui-view/>',
		    controller: 'CategoriasController'
		}).
		state('categorias.list', {
			url: '',
			templateUrl: 'modules/categorias/client/views/list-categorias.client.view.html',
			controller: 'ListCategoriasController'
		}).
		state('categorias.create', {
			url: '/create',
			templateUrl: 'modules/categorias/client/views/create-categoria.client.view.html',
			controller: 'CategoriasController'
		}).
		state('categorias.view', {
			url: '/:categoriaId',
			templateUrl: 'modules/categorias/client/views/view-categoria.client.view.html',
			controller: 'CategoriasController'
		}).
		state('categorias.edit', {
			url: '/:categoriaId/edit',
			templateUrl: 'modules/categorias/client/views/edit-categoria.client.view.html',
			controller: 'CategoriasController'
		});
	}
]);

