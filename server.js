var express = require("express"),
	server = express(),
	swig = require("swig"),
	bodyParser = require("body-parser");

server.engine("html", swig.renderFile);
server.set("view engine", "html");
server.set("views", __dirname + '/views')

server.use(express.static("public"));
server.use(bodyParser.urlencoded({
	extended: true
}));
server.use(bodyParser.json());

var servidor = require("./models/servidor");
var querys = require("./controllers/querys");

//RESPUESTAS DE LA API

server.get("/alumnos/:id/constancia", querys.generaConstancia)
server.get("/alumnos/constancias", querys.getConstancias)

server.get("/alumnos", querys.allServidores);
server.get("/alumnos/:numControl", querys.servidorPorNumControl);
server.get("/alumnos/id/:id", querys.findByID);
var validar = function (req, res, next) {
	if (req.method == "POST" || req.method == "PUT") {
		var body = req.body;
		if (body.numcontrol != null && body.numcontrol !== "" && body.nombrealumno !== "" && body.nombrealumno !== null &&
			body.fechainicio !== null && body.fechatermino !== null) {
			console.log("paso")
			next();
		} else
			res.status(400)
			.
		json({
			status: "Denegado",
			message: "Operacion denegada por datos incorrectos"
		});
	} else {
		next();
	}
};
//server.use(validar);
server.put("/alumnos/:id", querys.actualizarServidor);
server.delete("/alumnos/:id", querys.eliminarServidor);
var existe = function existe(req, res, next) {
	if (req.method == "POST") {
		servidor.findOne({
				where: {
					numcontrol: req.body.numControl
				}
			})
			.then(function (d) {
				if (d) {
					res.status(400)
						.json({
							message: "Ese Número de control ya existe",
							data: d
						});
				} else {
					req.body.nombre = req.body.nombre + " " + req.body.apPat + " " + req.body.apMat;
					next();
				}
			})
	} else {
		next();
	}
}
server.use(existe);
server.post("/alumnos", querys.nuevoServidor)

server.get("/", function (req, res) {
	res.sendFile(__dirname + "/public/templates/template.html");
});


var isEmpty = function (obj) {
	return Object.keys(obj)
		.length === 0;
}

server.listen(3000, function () {
	console.log("Iniciando")
});
