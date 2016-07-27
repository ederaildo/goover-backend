var keystone = require('keystone');

/**
 * Genero Model
 * ==================
 */

var Genero = new keystone.List('Genero', {
    plural: 'generos',
	map: { name: 'nome' },
	autokey: { from: 'nome', path: 'key', unique: true },
});

Genero.add({
	nome: { type: String, required: true, initial: true},
});

Genero.relationship({ ref: 'Programa', path: 'generos' });

Genero.defaultColumns = 'nome';

Genero.register();
