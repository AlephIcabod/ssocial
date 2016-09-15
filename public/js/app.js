(function () {
	var app = angular.module("app", ["ngRoute", "ngAnimate", "ui.materialize", "nvd3", "satellizer"])
		.controller("mainController", ["$http", function ($http) {
			this.largo = true
		}])
		.config(function ($routeProvider, $authProvider) {
			console.log($authProvider);
			$authProvider.loginUrl = "/login";
			$authProvider.tokenPrefix = "AppSS";

			$routeProvider.when("/sistema", {
					controller: "homeController",
					controllerAs: "control",
					templateUrl: "templates/inicio.html",
					authenticated: true
				})
				.when("/nuevo", {
					controller: "nuevoController",
					controllerAs: "control",
					templateUrl: "templates/nuevo.html",
					authenticated: true
				})
				.when("/alumnos/:id", {
					controller: "editController",
					controllerAs: "control",
					templateUrl: "templates/editar.html",
					authenticated: true
				})
				.when("/notFound", {
					controller: function () {},
					controllerAs: "control",
					templateUrl: "templates/notFound.html"
				})
				.when("/estadisticas", {
					controller: "estadisticasController",
					controllerAs: "control",
					templateUrl: "templates/estadisticas.html",
					authenticated: true
				})
				.when("/constancias", {
					controller: "constanciasController",
					controllerAs: "control",
					templateUrl: "templates/cartas.html",
					authenticated: true
				})
				.when("/", {
					controller: "loginController",
					controllerAs: "control",
					templateUrl: "templates/login.html"
				})
				.otherwise("/notFound")
		})

	app.factory("authFact", [function () {
		var authFact = {};
		authFact.setAccessToken = function (accessToken) {
			authFact.authToken = accessToken;
		};
		authFact.getAcccessToken = function () {
			return authFact.authToken;
		}
		return authFact;
	}]);



	app.run(["$rootScope", "$location", "authFact", function ($rootScope, $location, authFact) {
		$rootScope.$on("$routeChangeStart", function (event, next, current) {
			if (next.$$route.authenticated) {
				var userAuth = authFact.getAcccessToken();
				console.log(userAuth);
				if (!userAuth) {
					$location.path("/");
				}
			}
		});
	}]);
})();
