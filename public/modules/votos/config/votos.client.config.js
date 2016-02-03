'use strict';

// Configuring the Articles module
angular.module('votos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Votos', 'votos', 'dropdown', '/votos(/create)?');
		Menus.addSubMenuItem('topbar', 'votos', 'List Votos', 'votos');
		Menus.addSubMenuItem('topbar', 'votos', 'New Voto', 'votos/create');
	}
]);