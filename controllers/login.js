var service = require("./service");
var config = require("./config"),
	jwt = require("jwt-simple"),
	moment = require("moment");


var login = function (req, res, next) {
	if (req.body.username === config.username && req.body.password === config.password) {
		res.status(200)
			.send({
				token: service.createToken()
			});
	} else {
		res.status(401)
			.json({
				message: "Contraseña o usuario incorrecto"
			});
	}
};

var autentication = function (req, res, next) {
	console.log(req.headers.authorization)
	if (!req.headers.authorization) {
		return res.status(403)
			.send({
				message: "La peticion no tiene cabecera de identificacion"
			});
	}

	var token = req.headers.authorization.split(" ")[1];
	var payload = jwt.decode(token, config.token_secret);

	if (payload.exp <= moment.unix()) {
		return res.status(401)
			.send({
				message: "El token a expirado"
			});
	}
	req.user = payload.sub;
	next();
}

module.exports = {
	login: login,
	autentication: autentication
};
