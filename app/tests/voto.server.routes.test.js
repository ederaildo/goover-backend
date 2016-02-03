'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Voto = mongoose.model('Voto'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, voto;

/**
 * Voto routes tests
 */
describe('Voto CRUD tests', function() {
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

		// Save a user to the test db and create new Voto
		user.save(function() {
			voto = {
				name: 'Voto Name'
			};

			done();
		});
	});

	it('should be able to save Voto instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Voto
				agent.post('/votos')
					.send(voto)
					.expect(200)
					.end(function(votoSaveErr, votoSaveRes) {
						// Handle Voto save error
						if (votoSaveErr) done(votoSaveErr);

						// Get a list of Votos
						agent.get('/votos')
							.end(function(votosGetErr, votosGetRes) {
								// Handle Voto save error
								if (votosGetErr) done(votosGetErr);

								// Get Votos list
								var votos = votosGetRes.body;

								// Set assertions
								(votos[0].user._id).should.equal(userId);
								(votos[0].name).should.match('Voto Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Voto instance if not logged in', function(done) {
		agent.post('/votos')
			.send(voto)
			.expect(401)
			.end(function(votoSaveErr, votoSaveRes) {
				// Call the assertion callback
				done(votoSaveErr);
			});
	});

	it('should not be able to save Voto instance if no name is provided', function(done) {
		// Invalidate name field
		voto.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Voto
				agent.post('/votos')
					.send(voto)
					.expect(400)
					.end(function(votoSaveErr, votoSaveRes) {
						// Set message assertion
						(votoSaveRes.body.message).should.match('Please fill Voto name');
						
						// Handle Voto save error
						done(votoSaveErr);
					});
			});
	});

	it('should be able to update Voto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Voto
				agent.post('/votos')
					.send(voto)
					.expect(200)
					.end(function(votoSaveErr, votoSaveRes) {
						// Handle Voto save error
						if (votoSaveErr) done(votoSaveErr);

						// Update Voto name
						voto.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Voto
						agent.put('/votos/' + votoSaveRes.body._id)
							.send(voto)
							.expect(200)
							.end(function(votoUpdateErr, votoUpdateRes) {
								// Handle Voto update error
								if (votoUpdateErr) done(votoUpdateErr);

								// Set assertions
								(votoUpdateRes.body._id).should.equal(votoSaveRes.body._id);
								(votoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Votos if not signed in', function(done) {
		// Create new Voto model instance
		var votoObj = new Voto(voto);

		// Save the Voto
		votoObj.save(function() {
			// Request Votos
			request(app).get('/votos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Voto if not signed in', function(done) {
		// Create new Voto model instance
		var votoObj = new Voto(voto);

		// Save the Voto
		votoObj.save(function() {
			request(app).get('/votos/' + votoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', voto.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Voto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Voto
				agent.post('/votos')
					.send(voto)
					.expect(200)
					.end(function(votoSaveErr, votoSaveRes) {
						// Handle Voto save error
						if (votoSaveErr) done(votoSaveErr);

						// Delete existing Voto
						agent.delete('/votos/' + votoSaveRes.body._id)
							.send(voto)
							.expect(200)
							.end(function(votoDeleteErr, votoDeleteRes) {
								// Handle Voto error error
								if (votoDeleteErr) done(votoDeleteErr);

								// Set assertions
								(votoDeleteRes.body._id).should.equal(votoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Voto instance if not signed in', function(done) {
		// Set Voto user 
		voto.user = user;

		// Create new Voto model instance
		var votoObj = new Voto(voto);

		// Save the Voto
		votoObj.save(function() {
			// Try deleting Voto
			request(app).delete('/votos/' + votoObj._id)
			.expect(401)
			.end(function(votoDeleteErr, votoDeleteRes) {
				// Set message assertion
				(votoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Voto error error
				done(votoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Voto.remove().exec();
		done();
	});
});