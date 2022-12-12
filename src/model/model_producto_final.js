const{DataTypes}=require("sequelize")
const database=require("../database")
const receta=require("./model_receta")

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
    img:{
        type:DataTypes.BLOB("long")
    },
},{
    tableName:"Producto_final",
    timestamps:false
})

producto_final.hasMany(receta,{
    foreignKey:"idproducto_final",
    sourceKey:"idproducto_final"
});



module.exports=producto_final
