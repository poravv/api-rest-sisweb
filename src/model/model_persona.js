const DataType = require('sequelize')
const database = require('../database.js')
const ciudad=require("./model_ciudad")

const persona = database.define("persona",{
    idpersona:{
        type:DataType.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nombre:{
        type:DataType.STRING,
        allowNull:false
    },
    apellido:{
        type:DataType.STRING,
        allowNull:false
    },
    documento:{
        type:DataType.STRING,
        allowNull:false
    },
    nacimiento:{
        type:DataType.DATE,
        allowNull:false
    },
    sexo:{
        type:DataType.STRING,
        allowNull:false,
    },
    est_civil:{
        type:DataType.STRING,
        allowNull:false
    },
    direccion:{
        type:DataType.STRING,
        allowNull:false
    },
    estado:{
        type:DataType.STRING,
        allowNull:false
    },
    tipo_doc:{
        type:DataType.STRING,
        allowNull:false
    },
    nacionalidad:{
        type:DataType.STRING,
        allowNull:false
    },
    idciudad:{
        type:DataType.STRING,
        allowNull:false
    },
    correo:{
        type:DataType.STRING,
        allowNull:false
    },
    telefono:{
        type:DataType.STRING,
        allowNull:false
    }
},
{
    tableName:"Persona",
    timestamps:false
})

persona.hasOne(ciudad,{
    foreignKey:"idciudad",
    primaryKey:"idciudad"
})

module.exports=persona

