const DataType = require('sequelize')
const database = require('../database.js')
//const producto_final=require("./model_producto_final")
const producto=require("./model_producto")


const receta = database.define("receta",{
    idproducto:{
        type:DataType.INTEGER,
        primaryKey:true
    },
    idproducto_final:{
        type:DataType.INTEGER,
        primaryKey:true
    },
    estado:{
        type:DataType.STRING,
        allowNull:false,
        primaryKey:true
    },
    receta_estado:{
        type:DataType.STRING,
        allowNull:false
    },
    cantidad:{
        type:DataType.INTEGER,
        //allowNull:false
    }, 
},
{
    tableName:"Receta",
    timestamps:false
})

/*
receta.hasOne(producto_final,{
    foreignKey:"idproducto_final",
    primaryKey:"idproducto_final"
})
*/

receta.hasOne(producto,{
    foreignKey:"idproducto",
    primaryKey:"idproducto"
})

module.exports=receta

