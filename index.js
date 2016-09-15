var express = require("express"),
	server = express(),
	swig = require("swig"),
	bodyParser = require("body-parser"),
	logger = require("./logger"),
	cors = require("cors"),
	servidor = require("./models/servidor"),
	querys = require("./controllers/querys"),
	login = require("./controllers/login");


//configuracion de express
server.engine("html", swig.renderFile);
server.set("view engine", "html");
server.set("views", __dirname + '/views')
server.use(express.static("public"));
server.use(bodyParser.urlencoded({
	extended: true
}));
server.use(bodyParser.json());
server.use(cors());




//RESPUESTAS DE LA API

server.use(function (req, res, next) {
	logger.info("REQUEST " + req.method + " : " + req.url);
	next();
});
server.get("/alumnos/:id/constancia", querys.generaConstancia)
server.get("/alumnos/constancias", querys.getConstancias)
server.get("/alumnos", login.autentication, querys.allServidores);
server.get("/alumnos/:numControl", login.autentication, querys.servidorPorNumControl);
server.get("/alumnos/id/:id", querys.findByID);
server.put("/alumnos/id/:id", querys.actualizarServidor);
server.delete("/alumnos/id/:id", querys.eliminarServidor);

var existe = function existe(req, res, next) {
		if (req.method == "POST") {
			servidor.findOne({
					where: {
						numcontrol: req.body.servidor.numcontrol
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
						next();
					}
				});
		} else {
			next();
		}
	}
	//server.use(existe);
server.post("/alumnos", existe, querys.nuevoServidor);



server.post("/login", login.login);


server.get("/", function (req, res) {
	//res.send("hola");
	res.sendFile(__dirname + "/public/templates/template.html");
});


var isEmpty = function (obj) {
	return Object.keys(obj)
		.length === 0;
}
server.set("port", process.env.PORT || 3000)
server.listen(server.get("port"), function () {
	logger.info("Iniciando en el puerto", server.get("port"));
});
