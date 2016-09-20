var servidor = require("../models/servidor")
var _ = require("lodash")
var db = require("../conexion")
	.database,
	moment = require("moment");
moment()
	.format(),
	fs = require("fs"),
	Docxtemplater = require('docxtemplater');
var logger = require("../logger"),
	path = require("path");

var isEmpty = function (obj) {
	return Object.keys(obj)
		.length === 0;
}

var getAllServidores = function (req, res, next) {
	var options = req.query;
	if (isEmpty(options)) {
		var query = "SELECT * from servidores";
		db.query(query)
			.then(function (data) {
				logger.info("Ejecutado " + query);
				res.status(200)
					.json({
						status: 'success',
						data: data[0],
						message: 'todos los estudiantes'
					});
				next();
			});
	} else {

		var carreras = new Array();
		if (options.carrera !== undefined && options.carrera instanceof(Array)) {
			for (i = 0; i < options.carrera.length; i++)
				carreras.push({
					carrera: {
						$like: aux(options.carrera[i])
					}
				});
		} else carreras[0] = {
			carrera: {
				$like: aux(options.carrera)
			}
		};

		servidor.findAll({
				where: {
					sexo: {
						$like: aux(options.sexo)
					},
					fechatermino: {
						$between: rangoFecha(options)
					},
					dependencia: {
						$like: aux(options.dependencia.toUpperCase())
					},
					$or: carreras
				}
			})
			.then(function (data) {
				logger.info("Ejecutada consulta con parametros");
				res.status(200)
					.json({
						status: 'success',
						data: data,
						message: 'todos los estudiantes ' + data.length
					});
				next();
			});
	}
}

function aux(vari) {
	if (vari == undefined || vari == null) {
		return "%%";
	}
	return "%" + vari + "%";
}

function rangoFecha(options) {
	if (!options.fechainicio && !options.fechatermino) {
		return ['01/01/1950', new Date()];
	};
	if (options.fechainicio && options.fechatermino) {
		return [options.fechainicio, options.fechatermino]
	};
	if (options.fechainicio && !options.fechatermino) {
		return [options.fechainicio, new Date()]
	};
}

var servidorNumControl = function (req, res, next) {
	var nc = req.params.numControl;
	servidor.findAll({
			where: {
				$or: [{
					numcontrol: {
						$like: nc + '%'
					}
				}, {
					nombrealumno: {
						$like: nc.toUpperCase() + '%'
					}
				}]
			}
		})
		.then(function (data) {
			logger.info("Ejecutada busqueda de " + nc);
			if (data.length > 0) {
				res.status(200)
					.json({
						status: 'success',
						data: data,
						message: "Estudiante encontrado"
					});
				next();
			} else {
				res.status(404)
					.json({
						status: 'Not found',
						message: "Estudiante no encontrado"
					});
				next();
			}
		});
}

var newServidor = function (req, res, next) {
	servidor.max("numconstancia")
		.then(function (d) {
			var nuevo = req.body.servidor;
			if (nuevo.sexo == "el")
				nuevo.interesado = "al interesado";
			else {
				nuevo.interesado = "a la interesada";
			}
			periodo = moment(nuevo.fechainicio, 'YYYY-MM-DD',
					"es")
				.format("LL") + " al " + moment(nuevo.fechatermino, "YYYY-MM-DD", "es")
				.format("LL");
			nuevo.periodo = periodo.toUpperCase();
			nuevo.nombrealumno = nuevo.nombrealumno.toUpperCase();
			nuevo.carrera = nuevo.carrera.toUpperCase();
			nuevo.dependencia = nuevo.dependencia.toUpperCase();
			nuevo.actividades = nuevo.actividades.toUpperCase();

			nuevo.numconstancia = d + 1;
			var nuevoServidor = servidor.create(nuevo)
				.then(function (servidor) {
					logger.info("Se ha creado un nuevo registro con id " + servidor.id);
					res.status(201)
						.json({
							status: "Success",
							data: servidor,
							message: "Creado con exito"
						});
				})
				.error(function (e) {
					logger.error("error ", e);
					res.status(400)
						.json({
							message: "Error al procesar informacion",
							status: "Failled"
						});
				});

		});


}
var updateServidor = function (req, res, next) {
	servidor.findOne({
			where: {
				id: req.params.id
			}
		})
		.then(function (data) {
			if (data) {
				var servidorExistente = data.dataValues;
				var nuevo = req.body.servidor;
				_.merge(servidorExistente, nuevo);
				if (nuevo.sexo == "el")
					servidorExistente.interesado = "al interesado";
				else
					servidorExistente.interesado = "a la interesada";
				servidorExistente.periodo = moment(servidorExistente.fechainicio, 'YYYY-MM-DD', "es")
					.format("LL") + " al " + moment(servidorExistente.fechatermino, 'YYYY-MM-DD', "es")
					.format("LL");
				servidorExistente.periodo = servidorExistente.periodo.toUpperCase();
				servidorExistente.nombrealumno = servidorExistente.nombrealumno.toUpperCase();
				servidorExistente.carrera = servidorExistente.carrera.toUpperCase();
				servidorExistente.dependencia = servidorExistente.dependencia.toUpperCase();
				servidorExistente.actividades = servidorExistente.actividades.toUpperCase();

				servidor.update(servidorExistente, {
						where: {
							id: req.params.id
						},
						returning: true
					})
					.then(function (d) {
						logger.info("Actualizando datos del alumno con id " + d.id);
						res.status(200)
							.json({
								status: "Success",
								message: "Update successful",
								data: d[1]
							});
					})
					.error(function (e) {
						logger.error("error updating ", e);
						res.status(500)
							.json({});
					});

			}
		});
}

var buscarID = function (req, res, next) {
	servidor.findOne({
			where: {
				id: req.params.id
			}
		})
		.then(function (d) {
			logger.info("Ejecutada busqueda con id " + d.id);
			if (d)
				res.status(200)
				.json({
					status: "Success",
					data: d,
					message: "Encontrado"
				});
			else
				res.status(404)
				.json({
					status: "not found",
					message: "No encontrado"
				});
		})
		.error(function (e) {
			logger.error("Error en busqueda ", e);
			res.status(500);
		})
}

var generaConstancia = function (req, res, next) {
	servidor.findOne({
			where: {
				id: req.params.id
			}
		})
		.then(function (d) {
			if (d) {
				crearConstancia(d, function () {
					var filename = "constancia.docx";
					var filePath = __dirname + '/../files/' + filename;
					var stat = fs.statSync(filePath);
					var fileToSend = fs.readFileSync(filePath);
					res.set('Content-Type', 'docx/text');
					res.set('Content-Length', stat.size);
					res.set('Content-Disposition', filename);
					res.send(fileToSend);
					logger.info("Descarga de archivo de constancias");
				});

			}
		})
		.error(function (e) {
			logger.error("Error al crear constancias ", e);
			res.status(500);
		});
};

var constancias = function (req, res, next) {
	var finicio = req.query.fechainicio;
	var ftermino = req.query.fechatermino;

	servidor.findAll({
			where: {
				fechatermino: {
					$between: [finicio, ftermino]
				}
			}
		})
		.then(function (d) {
			if (d.length > 0) {
				crearConstancia(d, function () {
					var filename = "constancia.docx";
					var filePath = __dirname + '/../files/' + filename;
					var stat = fs.statSync(filePath);
					var fileToSend = fs.readFileSync(filePath);
					res.set('Content-Type', 'docx/text');
					res.set('Content-Length', stat.size);
					res.set('Content-Disposition', filename);
					res.send(fileToSend);
				});
			} else {
				res.status(404)
				res.json({
					status: "not found",
					message: "No hay servidores que concluyeran servicio social en ese periodo"
				})
			}

		})
		.error(function (e) {
			res.status(500);
		});
}

var crearConstancia = function (datos, cb) {
	var content = fs
		.readFileSync(path.join(__dirname, "../files", "plantilla.docx"));
	var doc = new Docxtemplater(content);
	//set the templateVariables
	doc.setData({
		alumnos: datos
	});
	doc.render();
	var buf = doc.getZip()
		.generate({
			type: "nodebuffer"
		});
	fs.writeFileSync(path.join(__dirname, "../files", "constancia.docx"), buf);
	cb();
}

var deleteServidor = function (req, res, next) {
	var _id = req.params.id;
	servidor.destroy({
			where: {
				id: _id
			}
		})
		.then(function (n) {
			logger.info("Eliminado " + n + " registros");
			if (n == 1)
				res.status(204)
				.json({});
			else {
				res.status(500)

			}
		})
		.catch(function (e) {
			logger.error("Error al eliminar ", e);
			res.status(500);
		})

}

module.exports = {
	allServidores: getAllServidores,
	servidorPorNumControl: servidorNumControl,
	nuevoServidor: newServidor,
	actualizarServidor: updateServidor,
	findByID: buscarID,
	generaConstancia: generaConstancia,
	getConstancias: constancias,
	eliminarServidor: deleteServidor
}
