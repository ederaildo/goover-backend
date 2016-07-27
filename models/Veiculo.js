var keystone = require('keystone');

/**
 * Veiculo Model
 * ==================
 */

var Veiculo = new keystone.List('Veiculo', {
    plural: 'veiculos',
	map: { name: 'nome' },
	autokey: { from: 'nome', path: 'key', unique: true },
});

Veiculo.add({
	nome: { type: String, required: true, initial: true},
});

Veiculo.relationship({ ref: 'Programa', path: 'veiculos' });

Veiculo.defaultColumns = 'nome';

Veiculo.register();
