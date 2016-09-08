database = require("../conexion").database;
Sequelize = require("../conexion").Sequelize;

servidor = database.define("servidor", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
    },
    numconstancia: {
        type: Sequelize.STRING,
        field: "numconstancia"
    },
    sexo: {
        type: Sequelize.STRING,
        field: "sexo"
    },
    nombrealumno: {
        type: Sequelize.STRING,
        field: "nombrealumno"
    },
    numcontrol: {
        type: Sequelize.STRING,
        field: "numcontrol"
    },
    carrera: {
        type: Sequelize.STRING,
        field: "carrera"
    },
    dependencia: {
        type: Sequelize.STRING,
        field: "dependencia"
    },
    actividades: {
        type: Sequelize.STRING,
        field: "actividades"
    },
    periodo: {
        type: Sequelize.STRING,
        field: "periodo"
    },
    interesado: {
        type: Sequelize.STRING,
        field: "interesado"
    },
    horas: {
        type: Sequelize.INTEGER,
        field: "horas"
    },

    fechainicio: {
        type: Sequelize.DATEONLY,
        field: "fechainicio"
    },
    fechatermino: {
        type: Sequelize.DATEONLY,
        field: "fechatermino"
    },
    calificado:{
      type:Sequelize.BOOLEAN,
      field:"calificado"
    },
    calificacion:{
      type:Sequelize.INTEGER,
      field:"calificacion"
    }
}, {
    timestamps: false,
    freezeTableName: false,
    tableName: "servidores"
});



module.exports = servidor;
