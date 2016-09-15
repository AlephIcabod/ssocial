var jwt = require("jwt-simple"),
	moment = require("moment"),
	config = require("./config");


exports.createToken = function () {
	var payload = {
		sub: config.userId,
		iat: moment.unix(),
		exp: moment()
			.add(6, "h")
			.unix()
	};
	return jwt.encode(payload, config.token_secret);
}
