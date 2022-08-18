const{DataTypes}=require("sequelize")
const sequelize=require("../database")
const inventario=require("../model/model_inventario")
const venta = require("../model/model_venta")

const det_venta=sequelize.define("det_venta",{
    idventa:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    idinventario:{
        type:DataTypes.INTEGER,
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
    },
    tipo_iva:{
        type:DataTypes.DECIMAL(13.2),
        allowNull:false
    },
    iva:{
        type:DataTypes.STRING,
        allowNull:false
    },
},{
    tableName:"Det_venta",
    timestamps:false
})

det_venta.hasOne(inventario,{
    foreignKey:"idinventario",
    sourceKey:"idinventario"
})

det_venta.hasOne(venta,{
    foreignKey:"idventa",
    sourceKey:"idventa"
})

module.exports=det_venta