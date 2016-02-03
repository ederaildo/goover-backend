'use strict';

// Configuring the Programas module
angular.module('programas',['ngTagsInput', 'ImageCropper', 'checklist-model']).run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar',{
			title: 'Cadastro',
			state: 'programas',
			type: 'dropdown', 
			roles: ['admin']
		});
	 	Menus.addSubMenuItem('topbar', 'programas', {
			title: 'Listar Programas',
			state: 'listProgramas',
			roles: ['admin']
		});
		Menus.addSubMenuItem('topbar', 'programas', {
			title: 'Novo Programa',
			state: 'createProgramas',
			roles: ['admin']
		});
		Menus.addSubMenuItem('topbar', 'programas', {
			title: 'Destaques (Topo)',
			state: 'listDestaqueTopo',
			roles: ['admin']
		});
		Menus.addSubMenuItem('topbar', 'programas', {
			title: 'Destaques (Meio)',
			state: 'listDestaqueMeio',
			roles: ['admin']
		});
		Menus.addSubMenuItem('topbar', 'programas', {
			title: 'Listar Categorias',
			state: 'categorias.list',
			roles: ['admin']
		});
		Menus.addSubMenuItem('topbar', 'programas', {
			title: 'Nova Categoria',
			state: 'categorias.create',
			roles: ['admin']
		});
    }
]);
