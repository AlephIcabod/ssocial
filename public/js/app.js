(function(){
	var app=angular.module("app",["ngRoute","ngAnimate","ui.materialize","nvd3"])		
		.controller("mainController",["$http",function($http){
			this.largo=true
		}])
		.config(function($routeProvider){
			$routeProvider.when("/",{
				controller:"homeController",
				controllerAs:"control",
				templateUrl:"templates/inicio.html"
			})
			.when("/nuevo",{
				controller:"nuevoController",
				controllerAs:"control",
				templateUrl:"templates/nuevo.html"
			})
			.when("/alumnos/:id",{
				controller:"editController",
				controllerAs:"control",
				templateUrl:"templates/editar.html"
			})
			.when("/notFound",{
				controller:function(){},
				controllerAs:"control",
				templateUrl:"templates/notFound.html"
			})
			.when("/estadisticas",{
				controller:"estadisticasController",
				controllerAs:"control",
				templateUrl:"templates/estadisticas.html"
			})
			.when("/constancias",{
				controller:"constanciasController",
				controllerAs:"control",
				templateUrl:"templates/cartas.html"
			})
			.otherwise("/notFound")
		})

		
}
	)();

