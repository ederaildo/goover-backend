'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	path = require('path'),
	config = require(path.resolve('./config/config')),
	random = require('mongoose-simple-random');

/**
 * Programa Schema
 */
var ProgramaSchema = new Schema({
	nome: {
		type: String,
		default: '',
		required: 'Please fill Programa name',
		trim: true
	},
	sinopse: {
		type: String,
		default: '',
		trim: true
    },
    categorias: [{
    	type: Schema.ObjectId,
    	ref: 'Categoria' 
    }],
    tags: [{
    	type: [String]
    }],
    veiculos: [{
    	type: [String]
    }],
    destaques: [{
    	type: [String]
    }],
	visivel: {
		type: Boolean,
		default: true
    },
	backdrop: {
		type: String,
		trim: true,
		default: 'default.png'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
}, {
	  toObject: {
		  virtuals: true
		  },
		  toJSON: {
		  virtuals: true 
		  }
});

ProgramaSchema
	.virtual('backdropFull')
	.get(function () {
	  return config.configApp.urlBackdrop + this.backdrop;
});

ProgramaSchema
	.virtual('urlVoto')
	.get(function () {
	  return config.configApp.urlVoto + this._id + "/";
});

ProgramaSchema
	.virtual('scoreVotos')
	.get(function () {
	  return Math.floor((Math.random() * 5) + 1);
});

mongoose.model('Programa', ProgramaSchema);