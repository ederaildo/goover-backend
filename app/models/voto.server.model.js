'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Voto Schema
 */
var VotoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Voto name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Voto', VotoSchema);