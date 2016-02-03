'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Categoria = mongoose.model('Categoria'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, categoria;

/**
 * Categoria routes tests
 */
describe('Categoria CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Categoria
		user.save(function() {
			categoria = {
				name: 'Categoria Name'
			};

			done();
		});
	});

	it('should be able to save Categoria instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Categoria
				agent.post('/categorias')
					.send(categoria)
					.expect(200)
					.end(function(categoriaSaveErr, categoriaSaveRes) {
						// Handle Categoria save error
						if (categoriaSaveErr) done(categoriaSaveErr);

						// Get a list of Categorias
						agent.get('/categorias')
							.end(function(categoriasGetErr, categoriasGetRes) {
								// Handle Categoria save error
								if (categoriasGetErr) done(categoriasGetErr);

								// Get Categorias list
								var categorias = categoriasGetRes.body;

								// Set assertions
								(categorias[0].user._id).should.equal(userId);
								(categorias[0].name).should.match('Categoria Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Categoria instance if not logged in', function(done) {
		agent.post('/categorias')
			.send(categoria)
			.expect(401)
			.end(function(categoriaSaveErr, categoriaSaveRes) {
				// Call the assertion callback
				done(categoriaSaveErr);
			});
	});

	it('should not be able to save Categoria instance if no name is provided', function(done) {
		// Invalidate name field
		categoria.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Categoria
				agent.post('/categorias')
					.send(categoria)
					.expect(400)
					.end(function(categoriaSaveErr, categoriaSaveRes) {
						// Set message assertion
						(categoriaSaveRes.body.message).should.match('Please fill Categoria name');
						
						// Handle Categoria save error
						done(categoriaSaveErr);
					});
			});
	});

	it('should be able to update Categoria instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Categoria
				agent.post('/categorias')
					.send(categoria)
					.expect(200)
					.end(function(categoriaSaveErr, categoriaSaveRes) {
						// Handle Categoria save error
						if (categoriaSaveErr) done(categoriaSaveErr);

						// Update Categoria name
						categoria.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Categoria
						agent.put('/categorias/' + categoriaSaveRes.body._id)
							.send(categoria)
							.expect(200)
							.end(function(categoriaUpdateErr, categoriaUpdateRes) {
								// Handle Categoria update error
								if (categoriaUpdateErr) done(categoriaUpdateErr);

								// Set assertions
								(categoriaUpdateRes.body._id).should.equal(categoriaSaveRes.body._id);
								(categoriaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Categorias if not signed in', function(done) {
		// Create new Categoria model instance
		var categoriaObj = new Categoria(categoria);

		// Save the Categoria
		categoriaObj.save(function() {
			// Request Categorias
			request(app).get('/categorias')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Categoria if not signed in', function(done) {
		// Create new Categoria model instance
		var categoriaObj = new Categoria(categoria);

		// Save the Categoria
		categoriaObj.save(function() {
			request(app).get('/categorias/' + categoriaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', categoria.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Categoria instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Categoria
				agent.post('/categorias')
					.send(categoria)
					.expect(200)
					.end(function(categoriaSaveErr, categoriaSaveRes) {
						// Handle Categoria save error
						if (categoriaSaveErr) done(categoriaSaveErr);

						// Delete existing Categoria
						agent.delete('/categorias/' + categoriaSaveRes.body._id)
							.send(categoria)
							.expect(200)
							.end(function(categoriaDeleteErr, categoriaDeleteRes) {
								// Handle Categoria error error
								if (categoriaDeleteErr) done(categoriaDeleteErr);

								// Set assertions
								(categoriaDeleteRes.body._id).should.equal(categoriaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Categoria instance if not signed in', function(done) {
		// Set Categoria user 
		categoria.user = user;

		// Create new Categoria model instance
		var categoriaObj = new Categoria(categoria);

		// Save the Categoria
		categoriaObj.save(function() {
			// Try deleting Categoria
			request(app).delete('/categorias/' + categoriaObj._id)
			.expect(401)
			.end(function(categoriaDeleteErr, categoriaDeleteRes) {
				// Set message assertion
				(categoriaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Categoria error error
				done(categoriaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Categoria.remove().exec();
		done();
	});
});