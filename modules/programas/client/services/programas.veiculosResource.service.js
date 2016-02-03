'use strict';

angular.module('programas').factory('programasVeiculosResources', function ($resource) {
    return $resource('modules/programas/client/config/programas.list.veiculos.json');
});