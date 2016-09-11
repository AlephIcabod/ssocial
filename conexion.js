var Sequelize = require("sequelize");

database = new Sequelize("servicio", "postgres", "", {
	host: "localhost",
	dialect: "postgres",
	pool: {
		max: 10,
		min: 0,
		idle: 10000
	},
	logging: false
		//	omitNull: true
});



module.exports = {
	database: database,
	Sequelize: Sequelize
}
