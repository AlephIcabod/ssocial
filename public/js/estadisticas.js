var app=angular.module("app")
	.factory("_",["$window",function($window){
		return $window._;
	}])
	.controller("estadisticasController",["$http","_",function($http,_){			
			control=this;
			this.tipoBarras=1;
			this.data=[];
			this.currentCarrera="Todas las carreras";
			this.options={};							
			this.todos=[];
			$http.get("/alumnos")
			.success(function(d){
				control.todos=d.data;				
				control.carreras=_.groupBy(control.todos,"carrera");				
				control.nameCarreras=_.keysIn(control.carreras);				
			});

			this.api;


			this.barras=function(){	

				control.encabezado="Servidores sociales"
				control.options={
						chart: {
				        type: 'discreteBarChart',			        
				        height: 600,
				        margin : {
				            top: 20,
				            right: 10,
				            bottom: 180,
				            left: 60
				        },
				        x: function(d){ 				        					        		
				        	return d.label;},
				        y: function(d){ return d.value; },
				        showValues: true,
				        valueFormat: function(d){
				            return d3.format(',')(d);
				        },
				        transitionDuration: 2500,
				        xAxis: {
				            axisLabel: 'Carrera',				            
				            fontSize:".65em",
				            rotateLabels:"-90",
				            axisLabelDistance:10				           
				        },
				        yAxis: {
				            axisLabel: 'Alumnos',
				            axisLabelDistance:10
				        },
				        wrapLabels:true,}
						};
				if(control.anio!=undefined){
					control.encabezado+=" "+control.anio
					var carreras=_.groupBy(control.todos,function(i){
						x=new Date(i.fechainicio)
						return x.getFullYear();
					})								
					carreras=_.get(carreras,control.anio)					
					carreras=_.groupBy(carreras,"carrera");
					if(_.keysIn(carreras).length<=10)
						control.options.chart.xAxis.rotateLabels=0;
					control.data[0]={key:"Grafica de barras "+control.anio,
									values:_.zipWith(_.keysIn(carreras),_.valuesIn(carreras),
										function(a,b){
											return {label:a,value:b.length};
										})};
				}else{
					carreras=control.carreras;										
					control.data[0]={key:"POR CARRERA",
									values:_.zipWith(_.keysIn(carreras),_.valuesIn(carreras),function(a,b){
												return {label:a,value:b.length};
												})};					
					}
				};

			


			this.histograma=function(carrera){	
				control.encabezado="Servidores sociales de "+carrera;			
				control.options.chart={
					color:["#FF6600"],
					type:"historicalBarChart",
					 height: 500,
				     margin : {
				        top: 20,
				        right: 10,
			            bottom: 140,
			            left: 60
				        },
				     x:function(d){return d.label},
				     y:function(d){return d.value},
				     showValues: false,
				    duration: 100,
				    xAxis: {
				      axisLabel: "Año",
				      rotateLabels: 30,
				      showMaxMin: false
				    },
				    yAxis: {
				      axisLabel: "Servidores",
				      axisLabelDistance: -10
				    },
				    tooltip: {},
				    zoom: {
				      enabled: true,
				      scaleExtent: [
				        1,
				        10
				      ],
				      useFixedDomain: false,
				      useNiceScale: false,
				      horizontalOff: false,
				      verticalOff: true,
				      unzoomEventType: "dblclick.zoom"
				    }				    				       
				};



				var x;
				if(carrera!=="Todas las carreras") 
					 x=_.get(control.carreras,carrera)
				else
					x=control.todos				
				y=_.groupBy(x,function(i){					
					x=new Date(i.fechainicio)
					return x.getFullYear();})								
				control.data[0]={key:carrera||"Todas las carreras",
								values:_.zipWith(_.keysIn(y),_.valuesIn(y),function(a,b){
									return {label:a,value:b.length}
								})};
			}		
		}]);