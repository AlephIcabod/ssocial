var Sequelize = require("sequelize");

database = new Sequelize("servicio", "postgres", "israel123", {
	host: "localhost",
	dialect: "postgres",
	pool: {
		max: 10,
		min: 0,
		idle: 10000
	}
	//	omitNull: true
});



module.exports = {
	database: database,
	Sequelize: Sequelize
}
