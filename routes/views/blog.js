var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'blog';
	locals.filters = {
		categoria: req.params.categoria,
	};
	locals.data = {
		programas: [],
		categorias: [],
	};

	// Load all categorias
	view.on('init', function (next) {

		keystone.list('Categoria').model.find().sort('nome').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.categorias = results;

			// Load the counts for each categoria
			async.each(locals.data.categorias, function (categoria, next) {

				keystone.list('Programa').model.count().where('categorias').in([categoria.id]).exec(function (err, count) {
					categoria.programaCount = count;
					next(err);
				});

			}, function (err) {
				next(err);
			});
		});
	});

	// Load the current categoria filter
	view.on('init', function (next) {

		if (req.params.categoria) {
			keystone.list('Categoria').model.findOne({ key: locals.filters.categoria }).exec(function (err, result) {
				locals.data.categoria = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load the programas
	view.on('init', function (next) {

		var q = keystone.list('Programa').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				status: 'publicado',
			},
		})
			.sort('-dataPublicacao')
			.populate('autor categorias');

		if (locals.data.categoria) {
			q.where('categorias').in([locals.data.categoria]);
		}

		q.exec(function (err, results) {
			locals.data.programa = results;
			next(err);
		});
	});

	// Render the view
	view.render('blog');
};
