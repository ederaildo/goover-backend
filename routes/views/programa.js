var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'blog';
	locals.filters = {
		programa: req.params.programa,
	};
	locals.data = {
		programas: [],
	};

	// Load the current programa
	view.on('init', function (next) {

		var q = keystone.list('Programa').model.findOne({
			state: 'publicado',
			slug: locals.filters.programa,
		}).populate('autor categorias');

		q.exec(function (err, result) {
			locals.data.programa = result;
			next(err);
		});

	});

	// Load other programas
	view.on('init', function (next) {

		var q = keystone.list('Programa').model.find().where('status', 'publicado').sort('-dataPublicacao').populate('autor').limit('4');

		q.exec(function (err, results) {
			locals.data.programas = results;
			next(err);
		});

	});

	// Render the view
	view.render('programa');
};
