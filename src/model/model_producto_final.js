const{DataTypes}=require("sequelize")
const database=require("../database")

const producto_final = database.define("producto_final",{
    
    idproducto_final:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    estado:{
        type:DataTypes.STRING,
        allowNull:false
    },
    nombre:{
        type:DataTypes.STRING,
        allowNull:false
    },
    descripcion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    costo:{
        type:DataTypes.DECIMAL(13.2),
        allowNull:false
    },
    tipo_iva:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
},{
    tableName:"Producto_final",
    timestamps:false
})

module.exports=producto_final
