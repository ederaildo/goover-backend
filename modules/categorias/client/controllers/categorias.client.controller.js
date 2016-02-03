'use strict';

// Categorias controller
angular.module('categorias').controller('CategoriasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categorias',
	function($scope, $stateParams, $location, Authentication, Categorias) {
		$scope.authentication = Authentication;

		// Create new Categoria
		$scope.create = function() {
			// Create new Categoria object
			var categoria = new Categorias ({
				nome: this.nome
			});

			// Redirect after save
			categoria.$save(function(response) {
				$location.path('categorias/' + response._id);

				// Clear form fields
				$scope.nome = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Categoria
		$scope.remove = function(categoria) {
			if ( categoria ) { 
				categoria.$remove();

				for (var i in $scope.categorias) {
					if ($scope.categorias [i] === categoria) {
						$scope.categorias.splice(i, 1);
					}
				}
			} else {
				$scope.categoria.$remove(function() {
					$location.path('categorias');
				});
			}
		};

		// Update existing Categoria
		$scope.update = function() {
			var categoria = $scope.categoria;

			categoria.$update(function() {
				$location.path('categorias/' + categoria._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Categorias
		$scope.find = function() {
			$scope.categorias = Categorias.query();
		};
		
		// Find existing Categorias
		$scope.findOne = function() {
			$scope.categoria = Categorias.get({ 
				categoriaId: $stateParams.categoriaId
			});
		};

	}
]);