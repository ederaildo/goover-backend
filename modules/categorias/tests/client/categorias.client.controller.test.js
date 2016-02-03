'use strict';

(function() {
	// Categorias Controller Spec
	describe('Categorias Controller Tests', function() {
		// Initialize global variables
		var CategoriasController,
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

			// Initialize the Categorias controller.
			CategoriasController = $controller('CategoriasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Categoria object fetched from XHR', inject(function(Categorias) {
			// Create sample Categoria using the Categorias service
			var sampleCategoria = new Categorias({
				name: 'New Categoria'
			});

			// Create a sample Categorias array that includes the new Categoria
			var sampleCategorias = [sampleCategoria];

			// Set GET response
			$httpBackend.expectGET('categorias').respond(sampleCategorias);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.categorias).toEqualData(sampleCategorias);
		}));

		it('$scope.findOne() should create an array with one Categoria object fetched from XHR using a categoriaId URL parameter', inject(function(Categorias) {
			// Define a sample Categoria object
			var sampleCategoria = new Categorias({
				name: 'New Categoria'
			});

			// Set the URL parameter
			$stateParams.categoriaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/categorias\/([0-9a-fA-F]{24})$/).respond(sampleCategoria);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.categoria).toEqualData(sampleCategoria);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Categorias) {
			// Create a sample Categoria object
			var sampleCategoriaPostData = new Categorias({
				name: 'New Categoria'
			});

			// Create a sample Categoria response
			var sampleCategoriaResponse = new Categorias({
				_id: '525cf20451979dea2c000001',
				name: 'New Categoria'
			});

			// Fixture mock form input values
			scope.name = 'New Categoria';

			// Set POST response
			$httpBackend.expectPOST('categorias', sampleCategoriaPostData).respond(sampleCategoriaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Categoria was created
			expect($location.path()).toBe('/categorias/' + sampleCategoriaResponse._id);
		}));

		it('$scope.update() should update a valid Categoria', inject(function(Categorias) {
			// Define a sample Categoria put data
			var sampleCategoriaPutData = new Categorias({
				_id: '525cf20451979dea2c000001',
				name: 'New Categoria'
			});

			// Mock Categoria in scope
			scope.categoria = sampleCategoriaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/categorias\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/categorias/' + sampleCategoriaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid categoriaId and remove the Categoria from the scope', inject(function(Categorias) {
			// Create new Categoria object
			var sampleCategoria = new Categorias({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Categorias array and include the Categoria
			scope.categorias = [sampleCategoria];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/categorias\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCategoria);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.categorias.length).toBe(0);
		}));
	});
}());