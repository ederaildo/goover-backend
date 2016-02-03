'use strict';

//Votos service used to communicate Votos REST endpoints
angular.module('votos').factory('Votos', ['$resource',
	function($resource) {
		return $resource('votos/:votoId', { votoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);