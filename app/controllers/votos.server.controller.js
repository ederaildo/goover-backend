'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Voto = mongoose.model('Voto'),
	_ = require('lodash');

/**
 * Create a Voto
 */
exports.create = function(req, res) {
	var voto = new Voto(req.body);
	voto.user = req.user;

	voto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(voto);
		}
	});
};

/**
 * Show the current Voto
 */
exports.read = function(req, res) {
	res.jsonp(req.voto);
};

/**
 * Update a Voto
 */
exports.update = function(req, res) {
	var voto = req.voto ;

	voto = _.extend(voto , req.body);

	voto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(voto);
		}
	});
};

/**
 * Delete an Voto
 */
exports.delete = function(req, res) {
	var voto = req.voto ;

	voto.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(voto);
		}
	});
};

/**
 * List of Votos
 */
exports.list = function(req, res) { 
	Voto.find().sort('-created').populate('user', 'displayName').exec(function(err, votos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(votos);
		}
	});
};

/**
 * Voto middleware
 */
exports.votoByID = function(req, res, next, id) { 
	Voto.findById(id).populate('user', 'displayName').exec(function(err, voto) {
		if (err) return next(err);
		if (! voto) return next(new Error('Failed to load Voto ' + id));
		req.voto = voto ;
		next();
	});
};

/**
 * Voto authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.voto.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
