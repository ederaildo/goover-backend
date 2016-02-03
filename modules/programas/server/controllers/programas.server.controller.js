'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	path = require('path'),
	fs = require('fs'),
	errorHandler = require('../../../core/server/controllers/errors.server.controller'),
	Programa = mongoose.model('Programa'),
	config = require(path.resolve('./config/config')),
	_ = require('lodash');

/**
 * Create a Programa
 */
exports.create = function(req, res) {
	var programa = new Programa(req.body);
	programa.user = req.user;

	programa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programa);
		}
	});
};

/**
 * Show the current Programa
 */
exports.read = function(req, res) {
	res.jsonp(req.programa);
};

/**
 * Update a Programa
 */
exports.update = function(req, res) {
	var programa = req.programa ;

	programa = _.extend(programa , req.body);

	programa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programa);
		}
	});
};

/**
 * Delete an Programa
 */
exports.delete = function(req, res) {
	var programa = req.programa ;

	programa.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programa);
		}
	});
};

/**
 * List of Programas
 */
exports.list = function(req, res) { 
	Programa.find().sort('-created').populate('user', 'displayName').exec(function(err, programas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(programas);
		}
	});
};

exports.listDestaqueMeio = function(req, res) { 
	Programa.find({destaques:"destaque2"}).sort('-created').populate('user', 'displayName').exec(function(err, programas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(programas);
		}
	});
};

exports.listDestaqueTopo = function(req, res) { 
	Programa.find({destaques:"destaque1"}).sort('-created').populate('user', 'displayName').exec(function(err, programas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(programas);
		}
	});
};

exports.getHomeGooverApp = function(req, res) {
	
	var retornoHomeJson = {
			destaquesTopo :[],
			destaquesMeio :[],
			destaquesVotacao :[]
	};
	
	var queryDestaquesHome = 
	//Destaques Topo
	Programa.find(
			{ visivel : true }
	)
	.sort('created')
	.populate('categorias','_id nome' )
	.select({_id: 1, nome: 1, sinopse: 1,
			visivel: 1, tags: 1, categorias: 1,
			veiculos: 1, destaques: 1, backdropFull: 1,
			scoreVotos: 1 })
	.where('destaques').equals('destaque1')
	.exec(function(err, resultsTopo) {
		if (err) throw err;
		retornoHomeJson.destaquesTopo.push(resultsTopo);
			//Destaques Meio
			Programa.find(
					{ visivel : true }
			)
			.sort('created')
			.populate('categorias','_id nome' )
			.select({_id: 1, nome: 1, sinopse: 1,
					categorias: 1, visivel: 1, tags: 1,
					veiculos: 1, destaques: 1, backdropFull: 1,
					scoreVotos: 1 })
			.where('destaques').equals('destaque2')
			.exec(function(err, resultsMeio) {
				if (err) throw err;
				retornoHomeJson.destaquesMeio.push(resultsMeio);
				//Destaques Votacao
				Programa.find(
							{ visivel : true }
					)
					.populate('categorias','_id nome' )
					.limit(50)
					.select({_id: 1, nome: 1, sinopse: 1,
							categorias: 1, visivel: 1, tags: 1,
							veiculos: 1, destaques: 1, backdropFull: 1,
							urlVoto: 1})
					//.where('destaques').equals(['destaque1','destaque2'])
					.exec(function(err, resultsVotacao) {
						if (err) throw err;
						retornoHomeJson.destaquesVotacao.push(resultsVotacao);
						return res.json(retornoHomeJson);
					});
			});
    }) ;


	
	
};

function getDestaquesTopoApp () {
	
	var queryDestaquesTopo = Programa.find(
			{ visivel : true }
	)./*
	sort('created').
	select({_id: 1, nome: 1, sinopse: 1, categorias: 1, visivel: 1, tags: 1, veiculos: 1, destaques: 1, backdrop: 1}).
	where('destaques').equals('destaque1').*/
	exec(function(err, results) {
		if (err) throw err;
		console.log(results);
	    return results;        
    }) ;
	
}


/**
 * Programa middleware
 */
exports.programaByID = function(req, res, next, id) { 
	Programa.findById(id).populate('user', 'displayName').exec(function(err, programa) {
		if (err) return next(err);
		if (! programa) return next(new Error('Failed to load Programa ' + id));
		req.programa = programa ;
		next();
	});
};

/**
 * Programa authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.programa.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.uploadBackdrop = function (req, res) {
	//./public/img/programas/backdrop
	fs.writeFile('./public/img/programas/backdrop/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Ocorreu um erro durante o upload do backdrop'
        });
      } else {
    	res.jsonp(req.files);
      }
    });
};
	
	
	
	
	

