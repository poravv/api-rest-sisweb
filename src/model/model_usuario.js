const DataType = require('sequelize')
const database = require('../database')
const sucursal= require('./model_sucursal')
const persona= require('./model_persona')

const usuario= database.define("usuario",{
    idusuario:{
        type: DataType.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nivel:{
        type:DataType.STRING,
        allowNull:false
    },
    estado:{
        type:DataType.STRING,
        allowNull:false
    },
    nick:{
        type:DataType.STRING,
        allowNull:false
    },
    password:{
        type:DataType.STRING,
        allowNull:false
    },
    idpersona:{
        type:DataType.INTEGER,
        allowNull:false
    },
    idsucursal:{
        type:DataType.INTEGER,
        allowNull:false
    },
},
{
    tableName:"Usuario",
    timestamps:false
})

usuario.hasOne(sucursal,{
    foreignKey:"idsucursal",
    primaryKey:"idsucursal"
})

usuario.hasOne(persona,{
    foreignKey:"idpersona",
    primaryKey:"idpersona"
})

module.exports=usuario