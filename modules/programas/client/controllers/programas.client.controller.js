'use strict';

// Programas controller
angular.module('programas').controller('ProgramasController', [ '$http', '$scope', '$filter', '$stateParams', '$location', '$timeout', '$window' ,'Authentication', 'Programas', 'Categorias','FileUploader', 'programasVeiculosResources',
	function($http, $scope, $filter, $stateParams, $location, $timeout, $window,  Authentication, Programas, Categorias, FileUploader, programasVeiculosResources) {
		$scope.authentication = Authentication;
		$scope.categorias = Categorias.query();
		$scope.tagsList = "";//Programas.find({}).select({ tags: 1 }).exec();
		$scope.veiculosList = {};
		$scope.itemsPerPage = 5;
		$scope.currentPage = 1;
		$scope.programa = new Programas ();
		$scope.backdropFileName = "";
		$scope.selecaoCategorias = [];
		$scope.selecaoDestaques = [];
		$scope.categoriaList = Categorias.query();
		$scope.loadDestaque = false;
		//$scope.destaqueList = [{'Destaque 1', 'Destaque 2', 'Destaque 3'}];
		$scope.destaqueList = [{id: 'destaque1', nome: 'Destaque 1 (Topo)', selecionado: false},
		                       {id: 'destaque2', nome: 'Destaque 2 (Meio)', selecionado: false}];
		
		  $scope.pageCount = function () {
			    return Math.ceil($scope.programas.length / $scope.itemsPerPage);
		  };
		  
    
	    // Create file uploader instance
	    $scope.uploader = new FileUploader({
	      url: 'programas/backdrop'
	    });
		
		/* Destaques */
	    $scope.isDestaqueSelecionado = function(isSelec, dest){
	    	if(isSelec){
	    		dest.selecionado = true;
	    	}
	    	return isSelec;
	    };
	    
	    $scope.getDestaquesSelecionados = function(){
	        var destaqueSelecionados = [];
	        angular.forEach($scope.destaqueList, function(destaque){
	             if(destaque.selecionado){
	            	 destaqueSelecionados.push(destaque);
	             }
	        });
	        if(destaqueSelecionados.length === 0 ){
	        	return $scope.programa.destaques;
	        }
	        return destaqueSelecionados.map(function(d) { return d.id; });
	    };

		$scope.toggleSelectionDestaques = function toggleSelectionDestaques(destaqueNome) {
		    var idx = $scope.selecaoDestaques.indexOf(destaqueNome);

		if (idx > -1) {
		  $scope.selecaoDestaques.splice(idx, 1);
		}  else {
		   $scope.selecaoDestaques.push(destaqueNome);
		    }
		};

		/* Categorias */
		$scope.toggleSelectionCategorias = function toggleSelectionCategorias(catId) {
		     var idx = $scope.selecaoCategorias.indexOf(catId);
		     // is currently selected
		     if (idx > -1) {
		       $scope.selecaoCategorias.splice(idx, 1);
		     }else {
		       $scope.selecaoCategorias.push(catId);
		     }
		   };
		   
		/* Tags */   
        $scope.tagsInit = [];
        $scope.loadTags = function(query) {
          var tagsPadrao = [
                { text: 'Band' },
                { text: 'Record' },
                { text: 'HBO' }
              ];
          return tagsPadrao.filter({text: query});
          
	    };
	    
		/* Veiculos */   
        $scope.veiculosInit = [];

        programasVeiculosResources.get(function (data) {
            $scope.veiculosList = data.veiculos;
        });
        
        /*$scope.loadVeiculos = function(query) {
          return $scope.veiculosList;
	    };*/
	    
        $scope.loadVeiculos = function($query) {
              return $scope.veiculosList.filter(function(veiculo) {
                return veiculo.text.toLowerCase().indexOf($query.toLowerCase()) !== -1;
              });
        };
	    
       /* $scope.loadDestaques = function(query) {
            var tagsPadrao = [];
            return tagsPadrao.filter({text: query});
  	    };*/

		// Create new Programa
		$scope.create = function() {

			$scope.uploadBackdrop();
			
			// Create new Programa object
			var programa = new Programas ({
				nome: this.nome,
				sinopse: this.sinopse,
				tags: $scope.tagsInit.map(function(tag) { return tag.text; }),
				veiculos: $scope.veiculosInit.map(function(veiculo) { return veiculo.text; }),
				categorias: $scope.selecaoCategorias,
				destaques: $scope.getDestaquesSelecionados(),
				backdrop: $scope.backdropFileName,
				visivel: this.visivel
			});
			
			//var backdrop = $location.path('programas/addbackdrop/');
			
			// Upload backdrop Image and Redirect after save
			programa.$save(function(response) {
				
				$location.path('programas/' + response._id);
				
				// Clear form fields
				$scope.nome = '';
				$scope.sinopse = '';
				$scope.tags = '';
				$scope.veiculos = '';
				$scope.destaques = '';
				$scope.categorias = '';
				$scope.backdrop = '';
				$scope.visivel = false;
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			
			console.log(programa);
		};

		// Remove existing Programa
		$scope.remove = function(programa) {
			if ( programa ) { 
				programa.$remove();

				for (var i in $scope.programas) {
					if ($scope.programas [i] === programa) {
						$scope.programas.splice(i, 1);
					}
				}
			} else {
				$scope.programa.$remove(function() {
					$location.path('programas');
				});
			}
		};

		// Update existing Programa
		$scope.update = function() {
			var programa = $scope.programa;
			
			programa.tags = $scope.programa.tags.map(function(tag) { return tag.text; });
			programa.veiculos = $scope.programa.veiculos.map(function(veiculo) { return veiculo.text; });
			if($scope.backdropFileName !== ""){
				programa.backdrop = $scope.backdropFileName;	
			}

			//programa.categorias = $scope.selecaoCategorias;
			//programa.destaques = $scope.getDestaquesSelecionados();
			
			programa.$update(function() {
				$location.path('programas/' + programa._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		/*var appendCategoria = function appendCategoria(p) {
			p.categoria = $filter('filter')($scope.categorias, {_id: p.categoria})[0];
		};*/

		// Find a list of Products
		$scope.find = function() {
			Programas.query(function loadedProgramas(programas) {
				//programas.forEach(appendCategoria);
				$scope.programas = programas;
				$scope.programas.$promise.then(function () {
				    $scope.totalItems = $scope.programas.length;
				    $scope.$watch('currentPage + itemsPerPage', function() {
				      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
				        end = begin + $scope.itemsPerPage;
				      $scope.filteredProgramas = $scope.programas.slice(begin, end);
				    });
				});
			});
		};
		
		$scope.findDestaqueMeio = function() {
		    $http.get('/destaques/listDestaqueMeio')
	        .success(function(data) {
	        	$scope.programas = data;
	        })
	        .error(function(data) {
	            console.log('Error: ' + data);
	        });
		};
		
		$scope.findDestaqueTopo = function() {
		    $http.get('/destaques/listDestaqueTopo')
		        .success(function(data) {
		        	$scope.programas = data;
		        })
		        .error(function(data) {
		            console.log('Error: ' + data);
		        });
		};
		
		// Find a list of Programas
		/*$scope.find = function() {
			$scope.programas = Programas.query();
		};*/

     	// Find existing Programa
		$scope.findOne = function() {
			$scope.programa = Programas.get({ 
				programaId: $stateParams.programaId
			});
		};
		
		// Search for a product
		$scope.programaSearch = function(product) {
			$location.path('programas/' + product._id);
		};
		
		$scope.editInit = function() {
			$scope.programa = Programas.get({ 
				programaId: $stateParams.programaId
			});
		};		
		
		$scope.fileChanged = function(e) {			
			var files = e.target.files;
     		var fileReader = new FileReader();
			fileReader.readAsDataURL(files[0]);		
			
			fileReader.onload = function(e) {
				$scope.imgSrc = this.result;
				$scope.$apply();
			};
		};
	   
		$scope.clear = function() {
			 $scope.imageCropStep = 1;
			 delete $scope.imgSrc;
			 delete $scope.result;
			 delete $scope.resultBlob;
		};
		
		$scope.setCrop = function() {
			 $scope.imageCropStep = 3;
			 $scope.initCrop = true;
		};
		
		
		//Upload
		
	    $scope.doUploadBackdrop = function(){
	    	$scope.uploadBackdrop();
	    };
	    
	    $scope.doUploadBackdropEdit = function(){
	    	$scope.uploadBackdropEdit();
	    };
		
	    // Change user profile picture
	    $scope.uploadBackdrop = function () {
	      // Clear messages
	      $scope.success = $scope.error = null;

	      // Start upload
	      $scope.uploader.uploadAll();
	      
	      $location.path('programas/create');
	    };
	    
	    // Change user profile picture
	    $scope.uploadBackdropEdit = function () {
	      // Clear messages
	      $scope.success = $scope.error = null;
	      var programa = $scope.programa;

	      // Start upload
	      $scope.uploader.uploadAll();
	      $location.path('programas/' + programa._id + '/edit');

	    };
	    
	    // Called after the user has successfully uploaded a new picture
	    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
	      // Show success message
	      $scope.success = true;

	      //$scope.backdropFileName = fileItem._xhr.response;
	      $scope.backdropFileName = response.file.name;
	    };
	    
		/**
		   * Show preview with cropping
		   */
	    $scope.uploader.onAfterAddingFile = function(item) {
		    $scope.croppedImage = '';
		    var reader = new FileReader();
		    reader.onload = function(event) {
		      $scope.$apply(function(){
		        $scope.image = event.target.result;
		      });
		    };
		    reader.readAsDataURL(item._file);
		  };

		  /**
		   * Upload Blob (cropped image) instead of file.
		   * @see
		   *   https://developer.mozilla.org/en-US/docs/Web/API/FormData
		   *   https://github.com/nervgh/angular-file-upload/issues/208
		   */
		  $scope.uploader.onBeforeUploadItem = function(item) {
		    var blob = dataURItoBlob($scope.result);
		    item._file = blob;
		  };

		  /**
		   * Converts data uri to Blob. Necessary for uploading.
		   * @see
		   *   http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
		   * @param  {String} dataURI
		   * @return {Blob}
		   */
		  var dataURItoBlob = function(dataURI) {
		    var binary = atob(dataURI.split(',')[1]);
		    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
		    var array = [];
		    for(var i = 0; i < binary.length; i++) {
		      array.push(binary.charCodeAt(i));
		    }
		    return new Blob([new Uint8Array(array)], {type: mimeString});
		  };


	}
]);