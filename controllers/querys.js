var servidor = require("../models/servidor")
var db = require("../conexion").database,
    moment = require("moment");
moment().format(),
    fs = require("fs"),
    Docxtemplater = require('docxtemplater');;


var isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
}

var getAllServidores = function(req, res, next) {
    var options = req.query;
    if (isEmpty(options)) {
        var query = "SELECT * from servidores";
        db.query(query)
            .then(function(data) {
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
                    CARRERA: {
                        $like: aux(options.carrera[i])
                    }
                })
        } else carreras[0] = {
            CARRERA: {
                $like: aux(options.carrera)
            }
        };

        servidor.findAll({
                where: {
                    SEXO: {
                        $like: aux(options.sexo)
                    },
                    FECHAINICIO: {
                        $between: rangoFecha(options)
                    },
                    DEPENDENCIA: {
                        $like: aux(options.dependencia.toUpperCase())
                    },
                    $or: carreras
                }
            })
            .then(function(data) {
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

var servidorNumControl = function(req, res, next) {
    var nc = req.params.numControl;
    servidor.findAll({
            where: {
                $or: [{
                    NUMCONTROL: {
                        $like: nc + '%'
                    }
                }, {
                    NOMBREALUMNO: {
                        $like: nc.toUpperCase() + '%'
                    }
                }]
            }
        })
        .then(function(data) {
            if (data.length > 0) {
                res.status(200)
                    .json({
                        status: 'succes',
                        data: data,
                        message: "Estudiante encontrado"
                    });
                next();
            } else {
                res.status(404)
                    .json({
                        status: 'failled',
                        message: "Estudiante no encontrado"
                    });
                next();
            }
        });
}

var newServidor = function(req, res, next) {
    servidor.max("numconstancia")
        .then(function(d) {
            var sexo, interesado;
            if (req.body.sexo == "el") {
                sexo = "el"
                interesado = "el interesado"
            } else {
                sexo = "la";
                interesado = "la interesada"
            }
            periodo = moment(req.body.fechainicio, 'YYYY-MM-DD', "es").format("LL") + " al " + moment(req.body.fechatermino, 'YYYY-MM-DD', "es").format("LL");
            var servidorParams = {
                NUMCONSTANCIA: d + 1,
                SEXO: sexo,
                NOMBREALUMNO: req.body.nombre.toUpperCase(),
                NUMCONTROL: req.body.numControl,
                CARRERA: req.body.carrera.toUpperCase(),
                DEPENDENCIA: req.body.dependencia.toUpperCase(),
                ACTIVIDADES: req.body.actividades.toUpperCase(),
                PERIODO: periodo.toUpperCase(),
                INTERESADO: interesado.toLowerCase(),
                HORAS: req.body.horas,
                FECHAINICIO: req.body.fechainicio,
                FECHATERMINO: req.body.fechatermino,
                id: ''
            }
            servidor.create(servidorParams)
                .then(function(data) {
                    if (data) {
                        res.status(201)
                            .json({
                                status: 'success',
                                data: data,
                                message: "Alumno creado con exito"
                            });
                        next();
                    }
                });
        });


}
var updateServidor = function(req, res, next) {
    console.log(req.params)
    console.log("entrando a update")
    servidor.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(function(data) {
            if (data) {
                var sexo, interesado;
                if (req.body.sexo == "el") {
                    sexo = "el";
                    interesado = "el interesado"
                } else {
                    sexo = "la";
                    interesado = "la interesada";
                }
                periodo = moment(req.body.fechainicio, 'YYYY-MM-DD', "es").format("LL") + " al " + moment(req.body.fechatermino, 'YYYY-MM-DD', "es").format("LL");
                var servidorParams = {
                    NUMCONTROL: req.body.numControl,
                    SEXO: sexo,
                    NOMBREALUMNO: (req.body.nombre != undefined) ? req.body.nombre.toUpperCase() : data.NOMBREALUMNO,
                    NUMCONTROL: (req.body.numcontrol != undefined) ? req.body.numcontrol : data.NUMCONTROL,
                    CARRERA: (req.body.carrera != undefined) ? req.body.carrera.toUpperCase() : data.CARRERA,
                    DEPENDENCIA: (req.body.dependencia != undefined) ? req.body.dependencia.toUpperCase() : data.DEPENDENCIA,
                    ACTIVIDADES: (req.body.actividades != undefined) ? req.body.actividades.toUpperCase() : data.ACTIVIDADES,
                    PERIODO: (periodo != " al ") ? periodo.toUpperCase() : data.PERIODO,
                    INTERESADO: interesado.toLowerCase(),
                    HORAS: (req.body.horas != undefined) ? req.body.horas : data.HORAS,
                    FECHAINICIO: (req.body.fechainicio != undefined) ? req.body.fechainicio : data.FECHAINICIO,
                    FECHATERMINO: (req.body.fechatermino != undefined) ? req.body.fechatermino : data.FECHATERMINO
                }
                servidor.update(servidorParams, {
                    where: {
                        id: req.params.id
                    },
                    returning: true
                }).then(function(d) {
                    res.status(200)
                        .json({
                            status: 'Success',
                            data: d[1],
                            message: "Registros actualizados"
                        });
                    next();
                }).error(function(e) {
                    console.log(e);
                    next();
                });
            } else {
                res.status(400)
            }
        });
}

var buscarID = function(req, res, next) {
    servidor.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(function(d) {
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
        .error(function(e) {
            console.log(e)
            res.status(500);
        })
}

var generaConstancia = function(req, res, next) {
    servidor.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(function(d) {
            if (d) {
                crearConstancia(d);
                console.log(__dirname)
                var filename = "constancia.docx";
                var filePath = __dirname + '/../files/' + filename;
                var stat = fs.statSync(filePath);
                var fileToSend = fs.readFileSync(filePath);
                res.set('Content-Type', 'docx/text');
                res.set('Content-Length', stat.size);
                res.set('Content-Disposition', filename);
                res.send(fileToSend);
            }
        })
        .error(function(e) {
            res.status(500);
        });
};

var constancias = function(req, res, next) {
    var finicio = req.query.fechainicio;
    var ftermino = req.query.fechatermino;
    servidor.findAll({
            where: {
                FECHAINICIO: {
                    $between: rangoFecha(req.query)
                }
            }
        })
        .then(function(d) {
            if (d.length > 0) {
                crearConstancia(d);
                var filename = "constancia.docx";
                var filePath = __dirname + '/../files/' + filename;
                var stat = fs.statSync(filePath);
                var fileToSend = fs.readFileSync(filePath);
                res.set('Content-Type', 'docx/text');
                res.set('Content-Length', stat.size);
                res.set('Content-Disposition', filename);
                res.send(fileToSend);
            } else {
                res.status(404)
                res.json({
                    status: "not found",
                    message: "No hay servidores que concluyeran servicio social en ese periodo"
                })
            }
        })
        .error(function(e) {
            res.status(500);
        });
}

var crearConstancia = function(datos) {
    var content = fs
        .readFileSync("../sistema/files/plantilla.docx", "binary");
    var doc = new Docxtemplater(content);
    //set the templateVariables
    doc.setData({
        alumnos: datos
    });
    //apply them (replace all occurences of {first_name} by Hipp, ...)
    doc.render();
    var buf = doc.getZip()
        .generate({
            type: "nodebuffer"
        });
    fs.writeFileSync("../sistema/files/constancia.docx", buf);
}




module.exports = {
    allServidores: getAllServidores,
    servidorPorNumControl: servidorNumControl,
    nuevoServidor: newServidor,
    actualizarServidor: updateServidor,
    findByID: buscarID,
    generaConstancia: generaConstancia,
    getConstancias: constancias
}
