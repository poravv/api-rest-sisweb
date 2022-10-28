const{DataTypes}=require("sequelize")
const sequelize=require("../database")
const producto=require("./model_producto")
const sucursal=require("./model_sucursal")
const detinventario = require("../model/model_detinventario")

const inventario=sequelize.define("inventario",{
    idinventario:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    cantidad_total:{
        type:DataTypes.INTEGER,
        //allowNull:false
    },
    estado:{
        type:DataTypes.STRING
    },
    cantidad_ven:{
        type:DataTypes.INTEGER,
        //allowNull:false
    },
    idproducto:{
        type:DataTypes.INTEGER,
        //allowNull:false
    },
    idsucursal:{
        type:DataTypes.INTEGER,
        //allowNull:false
    }
},{
    tableName:"Inventario",
    timestamps:false
})

inventario.hasOne(producto,{
    foreignKey:"idproducto",
    sourceKey:"idproducto"
})

inventario.hasOne(sucursal,{
    foreignKey:"idsucursal",
    sourceKey:"idsucursal"
})

inventario.hasMany(detinventario,{
    foreignKey:"idinventario",
    sourceKey:"idinventario"
})

module.exports=inventario