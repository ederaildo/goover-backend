var keystone = require('keystone');

/**
 * Categoria Model
 * ==================
 */

var Categoria = new keystone.List('Categoria', {
    plural: 'categorias',
	map: { name: 'nome' },
	autokey: { from: 'nome', path: 'key', unique: true },
});

Categoria.add({
	nome: { type: String, required: true, initial: true},
});

Categoria.relationship({ ref: 'Programa', path: 'categorias' });

Categoria.defaultColumns = 'nome';

Categoria.register();
