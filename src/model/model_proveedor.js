const{DataTypes}=require("sequelize")
const database=require("../database")

const proveedor=database.define("proveedor",{
    idproveedor:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    razon_social:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ruc:{
        type:DataTypes.STRING,
        allowNull:false
    },
    direccion:{
        type:DataTypes.STRING
    },
    telefono:{
        type:DataTypes.STRING
    },
    estado:{
        type:DataTypes.STRING
    },
    
    fecha_insert:{
        type:DataTypes.DATE
    },
    fecha_upd:{
        type:DataTypes.DATE
    },
    idusuario_upd:{
        type:DataTypes.INTEGER,
        foreignKey:true
    },
},{
    tableName:"Proveedor",
    timestamps:false
})

module.exports=proveedor