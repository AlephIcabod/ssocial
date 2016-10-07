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


database
	.authenticate()
	.then(function (err) {
		console.log('Connection has been established successfully.');
	})
	.catch(function (err) {
		console.log('Unable to connect to the database:', err);
	});



module.exports = {
	database: database,
	Sequelize: Sequelize
}
