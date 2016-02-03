'use strict';

//Programas service used to communicate Programas REST endpoints
/*angular.module('programas').factory('Programas', ['$resource',
	function($resource) {
	    return $resource('programas/:programaId', { programaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);*/

angular.module('programas').factory('Programas', ['$resource',
  function($resource) {
  var resource = $resource('programas/:programaId', { programaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
  
  resource.getDestaques = function (destaquesParam) {
	    return this.query(
	      {
	        destaques: destaquesParam
	      });
  };

 /*
  resource.retrievePeople = function (peopleIdsArray) {
	    return this.query(
	      {
	        operation: "retrievearray",
	        "idsArray[]": peopleIdsArray
	      });
  };

  resource.getPrograma = function (programaId) {
    return this.get(
      {
        operation: "get",
        id: programaId
      });
  };

  resource.retrievePeople = function (peopleIdsArray) {
    return this.query(
      {
        operation: "retrievearray",
        "idsArray[]": peopleIdsArray
      });
  };

  // Custom function to save a person object
  resource.storePerson = function (person, picture) {
    return this.save(
      {
        operation: "store",
        firstName: person.firstName,
        lastName: person.lastName
      },
      picture
    );
  };

  // Custom function to delete a person object by ID
  resource.erasePerson = function (personId) {
    return this.delete(
      {
        operation: "erase",
        id: personId
      });
  };

  // Custom function to update the picture of a person
  resource.updatePersonPicture = function (personId, picture) {
    return this.updatePicture(
      {
        operation: "updatepicture",
        id: personId
      },
      picture
    );
  };*/

  return resource;
  
}]);


