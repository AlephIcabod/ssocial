var Sequelize = require("sequelize");

database = new Sequelize("cl19-servicio", "cl19-servicio", "servicio", {
	host: "79.170.40.181",
	dialect: "mysql",
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
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });



module.exports = {
	database: database,
	Sequelize: Sequelize
}
