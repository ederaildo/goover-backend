var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Programa Model
 * ==========
 */

var Programa = new keystone.List('Programa', {
	plural: 'programas',
	map: { name: 'titulo' },
	autokey: { path: 'slug', from: 'titulo', unique: true },
});

Programa.add({
	titulo: { type: String, required: true, initial: true },
	status: { type: Types.Select, options: 'rascunho, publicado, arquivado', default: 'rascunho', index: true },
	dataPublicacao: { type: Types.Date, index: true, default: Date.now, dependsOn: { status: 'publicado' } },
	backdrop: { type: Types.CloudinaryImage},
	categorias: { type: Types.Relationship, ref: 'Categoria', many: true },
	genero: { type: Types.Relationship, ref: 'Genero', label: 'Gênero', many: true },
	veiculos: { type: Types.Relationship, ref: 'Veiculo', label: 'Onde Passa', many: true },
	destaques: { type: Types.Relationship, ref: 'Destaque', many: true },
	conteudo: {
		sinopse: { type: Types.Textarea, height: 150 }
	},
});

Programa.schema.virtual('conteudo.full').get(function () {
	//return this.content.extended || this.content.brief;
	return this.conteudo.sinopse;
});

Programa.defaultColumns = 'titulo, status|20%, autor|20%, dataPublicacao|20%';
Programa.register();
