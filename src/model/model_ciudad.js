const{DataTypes}=require("sequelize")
const database=require("../database")

const ciudad = database.define("ciudad",{
    
    idciudad:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    descripcion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    estado:{
        type:DataTypes.STRING,
        allowNull:true
    }
},{
    tableName:"Ciudad",
    timestamps:false
})

module.exports=ciudad
