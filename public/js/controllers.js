var app = angular.module("app")
	.factory("utilityService", function () {
		return {
			ultimoID: 1,
			busqueda: "",
			getBusqueda: function () {
				return this.busqueda
			},
			setBusqueda: function (bus) {
				this.busqueda = bus
			}
		}
	})
	.controller("mainController", ["$location", "utilityService", "$route", function ($location, utilityService, $route) {
		mainCtrl = this;
		this.busqueda = utilityService.getBusqueda();
		this.buscar = function () {
			utilityService.setBusqueda(mainCtrl.busqueda);
			if ($location.path() === "/")
				$route.reload()
			else
				$location.path("/");

			mainCtrl.busqueda = "";
		}
	}])
	.controller("homeController", ["$http", "utilityService", function ($http, utilityService) {
		var control = this;
		this.query = {
			carrera: [],
			sexo: "",
			fechainicio: "",
			fechatermino: "",
			dependencia: ""
		}
		this.busNumControl = utilityService.getBusqueda();
		this.hideForm = false;
		this.alumnos = [];
		this.notFound = false;
		this.ejecutando = false;
		this.busquedaRapida = function () {
			control.alumnos = [];
			control.ejecutando = true;
			if (control.busNumControl === "") {
				control.ejecutando = false;
				control.notFound = false;
				return;
			}
			$http.get("/alumnos/" + control.busNumControl)
				.success(function (d) {
					control.alumnos = d.data;
					control.busNumControl = "";
					control.notFound = false;
					control.ejecutando = false;
					utilityService.setBusqueda(control.busNumControl)
				})
				.catch(function () {
					control.notFound = true;
					control.ejecutando = false;
					utilityService.setBusqueda(control.busNumControl)
				})
		};
		this.busquedaRapida();
		this.getAll = function () {
			control.alumnos = [];
			control.ejecutando = true;
			$http({
					method: "GET",
					url: "/alumnos",
					params: control.query
				})
				.success(function (d) {
					control.ejecutando = false;
					control.alumnos = d.data;
					control.hideForm = false;

				})
		};
		this.downloadConstancia = function (id) {
			$http({
					url: '/alumnos/' + id + '/constancia',
					method: "GET",
					responseType: 'blob'
				})
				.success(function (data, status, headers, config) {
					var blob = new Blob([data], {
						type: 'docx'
					});
					var fileName = headers('content-disposition');
					saveAs(blob, fileName);
				})
				.error(function (data, status, headers, config) {});
		}
		this.currentPage = 0;
		this.pageSize = 10;
		this.setPage = function (index) {
			control.currentPage = index - 1;
		};



	}])
	.filter('startFrom', function () {
		return function (input, start) {
			start = +start;
			return input.slice(start);
		};
	})
	.controller("editController", ["$http", "$routeParams", "$location", "$timeout", "utilityService", function ($http, $routeParams, $location, $timeout, utilityService) {
		control = this;
		this.carreras = ["INGENIERÍA INDUSTRIAL ELÉCTRICA",
			"INGENIERÍA INDUSTRIAL",
			"INGENIERÍA EN GESTIÓN EMPRESARIAL",
			"LICENCIATURA EN INFORMÁTICA",
			"LICENCIATURA EN CONTADURÍA",
			"INGENIERÍA EN SISTEMAS COMPUTACIONALES",
			"INGENIERÍA CIVIL",
			"INGENIERÍA INDUSTRIAL MECÁNICA",
			"INGENIERÍA QUÍMICA",
			"LICENCIATURA EN ADMINISTRACIÓN",
			"INGENIERÍA ELECTRÓNICA",
			"INGENIERÍA INDUSTRIAL QUÍMICA",
			"INGENIERÍA ELÉCTRICA",
			"INGENIERÍA MECÁNICA"
		];
		this.id = parseInt($routeParams.id);
		this.titulo = "Editar";
		this.cargar = function () {
			$http.get("/alumnos/id/" + control.id)
				.success(function (d) {
					var data = d.data;
					control.alumno = {
						nombrealumno: data.nombrealumno,
						carrera: data.carrera,
						sexo: data.sexo,
						numcontrol: data.numcontrol,
						dependencia: data.dependencia,
						actividades: data.actividades,
						fechainicio: new Date(data.fechainicio),
						fechatermino: new Date(data.fechatermino),
						horas: data.horas,
						numConstancia: data.numconstancia,
						id: parseInt(data.id),
						calificado: data.calificado,
						calificacion: parseInt(data.calificacion)
					}
					utilityService.ultimoID = control.id;
					control.titulo = data.nombrealumno;
					$timeout(function () {
						control.done = false;
					}, 1500);
				})
				.catch(function (e) {

					$location.path("/notFound")

				})
		};



		this.cargar();
		this.mensaje = "";
		this.done = false;
		this.success = true;
		this.enviar = function () {

			if (!control.alumno.calificado)
				control.alumno.calificacion = null;
			console.log(control.alumno);
			$http.put("/alumnos/" + control.id, {
					servidor: control.alumno
				})
				.success(function (d) {
					control.mensaje = "Cambios guardados con exito";
					control.done = true;
					control.success = true;
					control.cargar();
				})
				.catch(function (e) {
					control.mensaje = "error";
					control.done = true;
					control.success = false;
				});
		}
	}])
	.controller("constanciasController", ["$http", "$timeout", function ($http, $timeout) {
		var control = this;

		this.error = false;
		this.periodo = {
			fechainicio: "",
			fechatermino: new Date()
		};
		this.enviar = function () {
			control.doing = true;
			$http({
					method: "GET",
					url: "/alumnos/constancias",
					params: control.periodo,
					responseType: "blob"
				})
				.success(function (data, status, headers, config) {
					var blob = new Blob([data], {
						type: 'docx'
					});
					var fileName = headers('content-disposition');
					saveAs(blob, fileName);
					control.doing = false;
				})
				.error(function (data, status, headers, config) {
					control.error = true;
					control.mensaje = "No hay servidores sociales en ese periodo";
					$timeout(function () {
						control.error = false;
					}, 1500)
				});

		}
	}])
	.controller("nuevoController", ["$http", "$timeout", function ($http, $timeout) {
		control = this;
		this.titulo = "Agregar nuevo servidor social";
		this.carreras = ["Ingeniería Civil",
			"Ingeniería Eléctrica",
			"Ingeniería en Electrónica",
			"Ingeniería en Gestión Empresarial",
			"Ingeniería Industrial",
			"Ingeniería Mecánica",
			"Ingeniería Química",
			"Ingeniería en Sistemas Computacionales",
			"Licenciatura en Administración"
		];
		this.done = false;
		this.success = false;
		this.id;
		this.alumno = {
			nombre: "",
			apPat: "",
			apMat: "",
			numcontrol: "",
			carrera: "",
			sexo: "",
			horas: "",
			dependencia: "",
			actividades: "Actividades administrativas",
			fechainicio: "",
			fechatermino: "",
			calificado: null,
			calificacion: 100
		}
		this.enviar = function () {
			control.alumno.nombrealumno = control.alumno.nombre + " " + control.alumno.apPat + " " + control.alumno.apMat;
			$http.post("/alumnos", {
					servidor: control.alumno
				})
				.success(function (d) {
					control.done = true;
					control.success = true;
					control.id = d.data.id;
					control.mensaje = "Registro exitoso " + d.data.nombrealumno;
					$timeout(function () {
						control.done = false;
						control.reset();
					}, 2500);
				})
				.error(function (d) {
					control.done = true;
					control.success = false;
					control.mensaje = "Algo salio mal con los datos, revisar";
				})
		};
		this.reset = function () {
			this.alumno = {
				nombre: "",
				apPat: "",
				apMat: "",
				numControl: "",
				carrera: "",
				sexo: "",
				horas: "",
				dependencia: "",
				actividades: "Actividades administrativas",
				fechainicio: "",
				fechatermino: "",
				calificado: null,
				calificacion: 100
			}
		};
	}]);
