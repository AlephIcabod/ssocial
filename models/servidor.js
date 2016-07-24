database=require("../conexion").database;
Sequelize=require("../conexion").Sequelize;

servidor=database.define("servidor",{
		id:{type:Sequelize.INTEGER,
			primaryKey:true,
			autoIncrement:true,
			field:"id"
		},
		NUMCONSTANCIA:{type:Sequelize.STRING,field:"numconstancia"},
		SEXO:{type:Sequelize.STRING,field:"sexo"},
		NOMBREALUMNO:{type:Sequelize.STRING,field:"nombrealumno"},
		NUMCONTROL:{type:Sequelize.STRING,field:"numcontrol"},
		CARRERA:{type:Sequelize.STRING,field:"carrera"},
		DEPENDENCIA:{type:Sequelize.STRING,field:"dependencia"},
		ACTIVIDADES:{type:Sequelize.STRING,field:"actividades"},
		PERIODO:{type:Sequelize.STRING,field:"periodo"},
		INTERESADO:{type:Sequelize.STRING,field:"interesado"},
		HORAS:{type:Sequelize.INTEGER,field:"horas"},
		
		FECHAINICIO:{type:Sequelize.DATEONLY,
					field:"fechainicio"},
		FECHATERMINO:{type:Sequelize.DATEONLY,
					field:"fechatermino"}			
	},
	{	timestamps:false,
		freezeTableName:false,
		tableName:"servidores"
	});



module.exports=servidor;