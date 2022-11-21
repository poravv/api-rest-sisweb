const{DataTypes}=require("sequelize")
const sequelize=require("../database")
const ciudad=require("./model_ciudad")

const clientes=sequelize.define("cliente",{
    idcliente:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    ruc:{
        type:DataTypes.STRING,
        allowNull:true
    },
    telefono:{
        type:DataTypes.STRING
    },
    direccion:{
        type:DataTypes.STRING
    },
    estado:{
        type:DataTypes.STRING
    },
    razon_social:{
        type:DataTypes.STRING,
        allowNull:false
    },
    correo:{
        type:DataTypes.STRING
    },
    lat:{
        type:DataTypes.STRING
    },
    long:{type:DataTypes.STRING},
    img:{
        type:DataTypes.BLOB("long")
    },
    idciudad:{
        type:DataTypes.INTEGER,
        foreignKey:true
    },
    tipo_cli:{
        type:DataTypes.STRING,
        allowNull:false
    },
    sexo:{
        type:DataTypes.STRING
    },
},{
    tableName:"Cliente",
    timestamps:false
})

clientes.hasOne(ciudad,{
    foreignKey:"idciudad",
    sourceKey:"idciudad"
})


module.exports=clientes