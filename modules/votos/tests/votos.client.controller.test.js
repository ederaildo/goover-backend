'use strict';

(function() {
	// Votos Controller Spec
	describe('Votos Controller Tests', function() {
		// Initialize global variables
		var VotosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Votos controller.
			VotosController = $controller('VotosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Voto object fetched from XHR', inject(function(Votos) {
			// Create sample Voto using the Votos service
			var sampleVoto = new Votos({
				name: 'New Voto'
			});

			// Create a sample Votos array that includes the new Voto
			var sampleVotos = [sampleVoto];

			// Set GET response
			$httpBackend.expectGET('votos').respond(sampleVotos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.votos).toEqualData(sampleVotos);
		}));

		it('$scope.findOne() should create an array with one Voto object fetched from XHR using a votoId URL parameter', inject(function(Votos) {
			// Define a sample Voto object
			var sampleVoto = new Votos({
				name: 'New Voto'
			});

			// Set the URL parameter
			$stateParams.votoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/votos\/([0-9a-fA-F]{24})$/).respond(sampleVoto);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.voto).toEqualData(sampleVoto);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Votos) {
			// Create a sample Voto object
			var sampleVotoPostData = new Votos({
				name: 'New Voto'
			});

			// Create a sample Voto response
			var sampleVotoResponse = new Votos({
				_id: '525cf20451979dea2c000001',
				name: 'New Voto'
			});

			// Fixture mock form input values
			scope.name = 'New Voto';

			// Set POST response
			$httpBackend.expectPOST('votos', sampleVotoPostData).respond(sampleVotoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Voto was created
			expect($location.path()).toBe('/votos/' + sampleVotoResponse._id);
		}));

		it('$scope.update() should update a valid Voto', inject(function(Votos) {
			// Define a sample Voto put data
			var sampleVotoPutData = new Votos({
				_id: '525cf20451979dea2c000001',
				name: 'New Voto'
			});

			// Mock Voto in scope
			scope.voto = sampleVotoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/votos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/votos/' + sampleVotoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid votoId and remove the Voto from the scope', inject(function(Votos) {
			// Create new Voto object
			var sampleVoto = new Votos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Votos array and include the Voto
			scope.votos = [sampleVoto];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/votos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleVoto);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.votos.length).toBe(0);
		}));
	});
}());