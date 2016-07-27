// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');

keystone.init({
	'name': 'Goover',
	'brand': 'Goover',
	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': ['templates', 'templates/views'],
	'view engine': 'jade',
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});
keystone.import('models');
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});
keystone.set('routes', require('./routes'));
keystone.set('signin logo', '/images/logo.png');
keystone.set('nav', {
	cadastro: ['Programa', 'Categoria', 'Genero', 'Veiculo', 'Destaque'],
	usuario: 'users',
});

keystone.start();
