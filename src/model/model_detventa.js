const{DataTypes}=require("sequelize")
const sequelize=require("../database")
const producto_final=require("./model_producto_final")

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

det_venta.hasOne(producto_final,{
    foreignKey:"idproducto_final",
    sourceKey:"idproducto_final"
})

module.exports=det_venta