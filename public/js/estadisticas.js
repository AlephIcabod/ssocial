var app = angular.module("app")
	.factory("_", ["$window", function ($window) {
			return $window._;
        }
    ])
	.controller("estadisticasController", ["$http", "_", function ($http, _) {
			control = this;
			this.tipoBarras = 1;
			this.data = [];
			this.currentCarrera = "Todas las carreras";
			this.options = {};
			this.todos = [];
			this.porGenero = true;
			control.ready = false;
			//obtener datos
			$http.get("/alumnos")
				.success(function (d) {
					control.todos = d.data;
					control.carreras = _.groupBy(control.todos, "carrera");
					control.nameCarreras = _.keysIn(control.carreras);
					control.ready = true;
				});
			this.api;
			//grafica de barras
			this.barras = function () {
				control.data = [];
				control.api.clearElement();
				if (control.porGenero) {
					control.multibar();
				} else {
					control.encabezado = "Servidores sociales"
					control.options = {
						chart: {
							type: 'discreteBarChart',
							height: 600,
							margin: {
								top: 20,
								right: 10,
								bottom: 130,
								left: 60
							},
							x: function (d) {
								return d.label;
							},
							y: function (d) {
								return d.value;
							},
							showValues: true,
							valueFormat: function (d) {
								return d3.format(',')(d);
							},
							transitionDuration: 2500,
							xAxis: {
								axisLabel: 'Carrera',
								fontSize: ".65em",
								rotateLabels: "-90",
								axisLabelDistance: 10
							},
							yAxis: {
								axisLabel: 'Alumnos',
								axisLabelDistance: 10
							},
							wrapLabels: true,
						}
					};

					if (control.anio != undefined) {
						control.encabezado += " " + control.anio
						var carreras = _.groupBy(control.todos, function (i) {
							x = new Date(i.fechainicio)
							return x.getFullYear();
						})
						carreras = _.get(carreras, control.anio)
						carreras = _.groupBy(carreras, "carrera");
						if (_.keysIn(carreras)
							.length <= 10)
							control.options.chart.xAxis.rotateLabels = 0;
						control.data[0] = {
							key: "Grafica de barras " + control.anio,
							values: _.zipWith(_.keysIn(carreras), _.valuesIn(carreras),
								function (a, b) {
									return {
										label: a,
										value: b.length
									};
								})
						};
					} else {
						carreras = control.carreras;
						control.data[0] = {
							key: "POR CARRERA",
							values: _.zipWith(_.keysIn(carreras), _.valuesIn(carreras), function (a, b) {
								return {
									label: a,
									value: b.length
								};
							})
						};
					}
				}
			};

			this.histograma = function (carrera) {
				control.api.clearElement();
				control.encabezado = "Servidores sociales de " + carrera;
				control.options.chart = {
					color: ["#FF6600"],
					type: "historicalBarChart",
					height: 500,
					margin: {
						top: 20,
						right: 10,
						bottom: 80,
						left: 60
					},
					x: function (d) {
						return d.label
					},
					y: function (d) {
						return d.value
					},
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
				if (carrera !== "Todas las carreras")
					x = _.get(control.carreras, carrera)
				else
					x = control.todos
				y = _.groupBy(x, function (i) {
					x = new Date(i.fechainicio)
					return x.getFullYear();
				})
				control.data[0] = {
					key: carrera || "Todas las carreras",
					values: _.zipWith(_.keysIn(y), _.valuesIn(y), function (a, b) {
						return {
							label: a,
							value: b.length
						}
					})
				};
			}

			this.multibar = function () {
				control.api.clearElement();
				control.encabezado = "Servidores sociales "
				control.options = {
					chart: {
						type: 'multiBarChart',
						height: 600,
						x: function (d) {
							return d.label;
						},
						y: function (d) {
							return d.value;
						},
						margin: {
							top: 50,
							right: 10,
							bottom: 100,
							left: 60
						},
						showValues: true,
						valueFormat: function (d) {
							return d3.format(',')(d);
						},
						transitionDuration: 2500,
						xAxis: {
							axisLabel: 'Carrera',
							fontSize: ".6em",
							rotateLabels: "-45",
							axisLabelDistance: 10
						},
						yAxis: {
							axisLabel: 'Alumnos',
							axisLabelDistance: 10
						},
						wrapLabels: true,
						reduceXTicks: false
					}
				};

				if (control.anio != undefined) {
					control.encabezado += " " + control.anio
					var carreras = _.groupBy(control.todos, function (i) {
						x = new Date(i.fechainicio)
						return x.getFullYear();
					})
					carreras = _.get(carreras, control.anio)
					carreras = _.groupBy(carreras, "carrera");
					if (_.keysIn(carreras)
						.length <= 10)
						control.options.chart.xAxis.rotateLabels = 0;
					control.data = [{
						key: "hombres",
						color: "#5555dd",
						values: _.zipWith(_.keysIn(carreras), _.valuesIn(carreras), function (a, b) {
							return {
								label: a,
								value: _.filter(b, function (i) {
										return i.sexo == "el"
									})
									.length
							}
						})
                    }, {
						key: "mujeres",
						color: "#dd5555",
						values: _.zipWith(_.keysIn(carreras), _.valuesIn(carreras), function (a, b) {
							return {
								label: a,
								value: _.filter(b, function (i) {
										return i.sexo !== "el"
									})
									.length
							}
						})
                    }];
				} else {
					carreras = control.carreras;
					control.data = [{
						key: "hombres",
						color: "#5555dd",
						values: _.zipWith(_.keysIn(carreras), _.valuesIn(carreras), function (a, b) {
							return {
								label: a,
								value: _.filter(b, function (i) {
										return i.sexo == "el"
									})
									.length
							}
						})
                    }, {
						key: "mujeres",
						color: "#dd5555",
						values: _.zipWith(_.keysIn(carreras), _.valuesIn(carreras), function (a, b) {
							return {
								label: a,
								value: _.filter(b, function (i) {
										return i.sexo !== "el"
									})
									.length
							}
						})
                    }];
				}
				control.range = [];
				control.totals = [0, 0, 0];
				for (var i = 0; i < control.data[0].values.length; i++) {
					control.range.push(i)
					control.totals[0] += control.data[0].values[i].value;
					control.totals[1] += control.data[1].values[i].value;
					control.totals[2] += control.data[0].values[i].value + control.data[1].values[i].value;
				}
			}
			control.aux = function () {
				var tableHead = [];
				var tableBody = [];
				if (!control.porGenero) {
					tableHead.push([{ text: control.options.chart.xAxis.axisLabel, style: "tableHeader" },
						{ text: control.options.chart.yAxis.axisLabel, style: "tableHeader" }]);
					tableBody = _.map(control.data[0].values, function (i) {
						return [{ text: i.label, style: "tableColumn" }, { text: "" + i.value, style: "tableColumn", alignment: "right" }];
					})
				} else {
					tableHead.push([{ text: control.options.chart.xAxis.axisLabel, style: "tableHeader" },
						{ text: "Hombres", style: "tableHeader" },
						{ text: "Mujeres", style: "tableHeader" },
						{ text: "Total", style: "tableHeader" }]);
					for (var l = 0; l < control.data[0].values.length; l++) {
						tableBody.push(
              [
								{ text: control.data[0].values[l].label, style: "tableColumn" },
								{ text: "" + control.data[0].values[l].value, style: "tableColumn", alignment: "right" },
								{ text: "" + control.data[1].values[l].value, style: "tableColumn", alignment: "right" },
								{ text: (control.data[0].values[l].value + control.data[1].values[l].value) + "", style: "tableColumn", alignment: "right" }
              ]
						)
					}

					tableBody.push([
						{ text: "TOTAL", style: "tableColumn", bold: true },
						{ text: "" + control.totals[0], style: "tableColumn" },
						{ text: "" + control.totals[1], style: "tableColumn" },
						{ text: "" + control.totals[2], style: "tableColumn" }
          ])
				}
				return _.concat(tableHead, tableBody);
			}

			// obtener pdf
			this.toPDF = function () {
				var docDefinition = {
					content: [
						{ text: "Instituto Tecnológico de Oaxaca", style: "encabezado" },
						{ text: "Departamento de Gestión tecnológica y vinculación ", style: "encabezado" },
						{ text: control.encabezado, style: "titulo" },
						{
							table: {
								style: "table",
								headerRows: 1,
								body: control.aux()
							}
						}
          ],
					styles: {
						encabezado: {
							fontSize: 16,
							bold: true,
							alignment: "center",
							margin: [0, 0, 0, 8]
						},
						titulo: {
							fontSize: 12,
							bold: true,
							alignment: "center",
							margin: [0, 0, 10, 8]
						},
						table: {
							alignment: "center"
						},
						tableHeader: {
							fillColor: "#f5af70",
							fontSize: 10,
							bold: true,
							alignment: "center",
							margin: [0, 0, 2, 2]
						},
						tableColumn: {
							fontSize: 9,
							margin: [0, 0, 1, 1]
						}
					}
				};
				pdfMake.createPdf(docDefinition)
					.download(control.encabezado);
			}



			}
			]);
