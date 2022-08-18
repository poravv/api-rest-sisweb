const{DataTypes}=require("sequelize")
const sequelize=require("../database")
const usuario=require("./model_usuario")

const preg_seguridad=sequelize.define("preg_seguridad",{
    idpreg_seguridad:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    pregunta:{
        type:DataTypes.STRING,
        allowNull:false
    },
    respuesta:{
        type:DataTypes.STRING
    },
    idusuario:{
        type:DataTypes.INTEGER,
        foreignKey:true
    },
},{
    tableName:"Preg_seguridad",
    timestamps:false
})

preg_seguridad.hasOne(usuario,{
    foreignKey:"idusuario",
    sourceKey:"idusuario"
})


module.exports=preg_seguridad