var winston = require("winston");
module.exports = new(winston.Logger)({
	transports: [
		// colorize the output to the console
		new(winston.transports.Console)({
			colorize: true,
			timestamp: (new Date())
				.toLocaleTimeString()
		}),
		new(winston.transports.File)({
			filename: "reporte.log"
		})
	]
});
