'use strict';

// Votos controller
angular.module('votos').controller('VotosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Votos',
	function($scope, $stateParams, $location, Authentication, Votos) {
		$scope.authentication = Authentication;

		// Create new Voto
		$scope.create = function() {
			// Create new Voto object
			var voto = new Votos ({
				name: this.name
			});

			// Redirect after save
			voto.$save(function(response) {
				$location.path('votos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Voto
		$scope.remove = function(voto) {
			if ( voto ) { 
				voto.$remove();

				for (var i in $scope.votos) {
					if ($scope.votos [i] === voto) {
						$scope.votos.splice(i, 1);
					}
				}
			} else {
				$scope.voto.$remove(function() {
					$location.path('votos');
				});
			}
		};

		// Update existing Voto
		$scope.update = function() {
			var voto = $scope.voto;

			voto.$update(function() {
				$location.path('votos/' + voto._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Votos
		$scope.find = function() {
			$scope.votos = Votos.query();
		};

		// Find existing Voto
		$scope.findOne = function() {
			$scope.voto = Votos.get({ 
				votoId: $stateParams.votoId
			});
		};
	}
]);