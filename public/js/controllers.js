var app=angular.module("app")
	.factory("utilityService",function(){
		return{
			ultimoID:1,
			busqueda:"",
			getBusqueda:function(){return this.busqueda},
			setBusqueda:function(bus){this.busqueda=bus}
		}
	})
	.controller("mainController",["$location","utilityService","$route",function($location,utilityService,$route){
			mainCtrl=this;
			this.busqueda=utilityService.getBusqueda();
			this.buscar=function(){
				utilityService.setBusqueda(mainCtrl.busqueda);
				if($location.path()==="/")
					$route.reload()
				else
				$location.path("/");

				mainCtrl.busqueda="";
			}
		}])
	.controller("homeController",["$http","utilityService",function($http,utilityService){
			var control=this;			
			this.query={
				carrera:[],
				sexo:"",
				fechainicio:"",
				fechatermino:"",
				dependencia:""
			}
			this.busNumControl=utilityService.getBusqueda();			
			this.hideForm=false;
			this.alumnos=[];
			this.notFound=false;
			this.ejecutando=false;			
			this.busquedaRapida=function(){	
				control.alumnos=[];
				control.ejecutando=true;
				if(control.busNumControl===""){					
					control.ejecutando=false;					
					control.notFound=false;return;}		
				$http.get("/alumnos/"+control.busNumControl)
				.success(function(d){					
					control.alumnos=d.data;
					control.busNumControl="";
					control.notFound=false;
					control.ejecutando=false;
					utilityService.setBusqueda(control.busNumControl)
				})
				.catch(function(){					
					control.notFound=true;					
					control.ejecutando=false;
					utilityService.setBusqueda(control.busNumControl)
				})						
			};
			this.busquedaRapida();
			this.getAll=function(){
				control.alumnos=[];
				control.ejecutando=true;
				$http({method:"GET",url:"/alumnos",params:control.query
				}).success(function(d){
					control.ejecutando=false;
					control.alumnos=d.data;
					control.hideForm=false;
						
				})
			};
			this.downloadConstancia=function(id){					
					 $http({
					      url: '/alumnos/'+id+'/constancia',
					      method: "GET",					      
					      responseType: 'blob'
					  }).success(function (data, status, headers, config) {					  	  
					      var blob = new Blob([data], { type: 'docx' });
					      var fileName = headers('content-disposition');
					      saveAs(blob, fileName);
					  }).error(function (data, status, headers, config) {					  						  						    
					  });
			}
			this.currentPage=0;
			this.pageSize=10;					
			this.setPage = function(index) {
   				control.currentPage = index - 1;
				};
		
			

			}])
	.filter('startFrom', function() {
   			return function(input, start) {
      			start = +start;
      			return input.slice(start);
   			};
		})
	.controller("editController",["$http","$routeParams","$location","$timeout","utilityService",function($http,$routeParams,$location,$timeout,utilityService){
		control=this;
		this.id=parseInt($routeParams.id);		
		this.titulo="Editar";			
		this.cargar=function(){
		$http.get("/alumnos/id/"+control.id)
			.success(function(d){
				var data=d.data;
				control.alumno={
					nombre:data.NOMBREALUMNO,
					carrera:data.CARRERA,
					sexo:data.SEXO,
					numControl:data.NUMCONTROL,
					dependencia:data.DEPENDENCIA,
					actividades:data.ACTIVIDADES,
					fechainicio:new Date(data.FECHAINICIO),
					fechatermino:new Date(data.FECHATERMINO),
					horas:data.HORAS,
					numConstancia:data.NUMCONSTANCIA,
					id:parseInt(data.id)
				}
				utilityService.ultimoID=control.id;		
				control.titulo=data.NOMBREALUMNO;
				$timeout(function(){					
					control.done=false;					
				},1500);
			})
			.catch(function(e){
						
					$location.path("/notFound")

			})	
		};



		this.cargar();		
		this.mensaje="";
		this.done=false;
		this.success=true;		
		this.enviar	=function(){						
			$http.put("/alumnos/"+control.id,control.alumno)
			.success(function(d){
				control.mensaje="Cambios guardados con exito";
				control.done=true;
				control.success=true;	
				control.cargar();			
			})
			.catch(function(e){
				control.mensaje="error";
				control.done=true;
				control.success=false;				
			});
		}	
		}])
	.controller("constanciasController",["$http","$timeout",function($http,$timeout){
			var control=this;
			this.error=false;
			this.periodo={
				fechainicio:"",
				fechatermino:new Date()
			};
			this.enviar=function(){
				$http({method:"GET",
						url:"/alumnos/constancias",params:control.periodo,
						responseType:"blob"})
					.success(function (data, status, headers, config) {					  	  
					      var blob = new Blob([data], { type: 'docx' });
					      var fileName = headers('content-disposition');
					      saveAs(blob, fileName);
					  }).error(function (data, status, headers, config) {
					  		control.error=true;
					  		control.mensaje="No hay servidores sociales en ese periodo";
					  		$timeout(function(){
					  			control.error=false;
					  		},1500)			
					  });

			}					
	}])	
	.controller("nuevoController",["$http",function($http){
		control=this;
		this.titulo="Agregar nuevo servidor social";
		this.carreras=["Ingeniería Civil",
					   "Ingeniería Eléctrica",
					   "Ingeniería en Electrónica",
					   "Ingeniería en Gestión Empresarial",
					   "Ingeniería Industrial",
					   "Ingeniería Mecánica",
					   "Ingeniería Química",
					   "Ingeniería en Sistemas Computacionales",
					   "Licenciatura en Administración"];
		this.done=false;
		this.success=false;
		this.id;
		this.alumno={nombre:"",
					apPat:"",
					apMat:"",
					numControl:"",
					carrera:"",
					sexo:"",
					horas:"",
					dependencia:"",
					actividades:"",
					fechainicio:"",
					fechatermino:""}
		this.enviar=function(){
			
		};
		this.reset=function(){};
	}])
	;
	

