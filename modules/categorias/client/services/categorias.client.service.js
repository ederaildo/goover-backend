'use strict';

//Categorias service used to communicate Categorias REST endpoints
angular.module('categorias').factory('Categorias', ['$resource',
	function($resource) {
		return $resource('categorias/:categoriaId', { categoriaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);