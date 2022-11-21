const{DataTypes}=require("sequelize")
const sequelize=require("../database")
const venta = require("../model/model_venta")

const det_venta=sequelize.define("det_venta",{
    idventa:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    idproducto_final:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    estado:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    cantidad:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    descuento:{
        type:DataTypes.DECIMAL(13.2),
        allowNull:false
    },
    subtotal:{
        type:DataTypes.DECIMAL(13.2),
        allowNull:false
    }
},{
    tableName:"Det_venta",
    timestamps:false
})


det_venta.hasOne(venta,{
    foreignKey:"idventa",
    sourceKey:"idventa"
})

module.exports=det_venta