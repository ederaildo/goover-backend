var keystone = require('keystone');

/**
 * Destaque Model
 * ==================
 */

var Destaque = new keystone.List('Destaque', {
    plural: 'destaques',
	map: { name: 'nome' },
	autokey: { from: 'nome', path: 'key', unique: true },
});

Destaque.add({
	nome: { type: String, required: true, initial: true},
});

Destaque.relationship({ ref: 'Programa', path: 'destaques' });

Destaque.defaultColumns = 'nome';

Destaque.register();
