const{DataTypes}=require("sequelize")
const database=require("../database")
const proveedor=require("./model_proveedor")

const producto=database.define("producto",{
    idproducto:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    descripcion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    precio:{
        type:DataTypes.DECIMAL(13.2)
    },
    peso:{
        type:DataTypes.DECIMAL(13.2)
    },
    estado:{
        type:DataTypes.STRING
    },
    idproveedor:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    fecha_insert:{
        type:DataTypes.DATE,
    },
    fecha_upd:{
        type:DataTypes.DATE,
    },
    idusuario_upd:{
        type:DataTypes.INTEGER
    },
    img:{
        type:DataTypes.BLOB("long")
    },
    idproveedor:{
        type:DataTypes.INTEGER,
        foreignKey:true
    },
},{
    tableName:"producto",
    timestamps:false
})

producto.hasOne(proveedor,{
    foreignKey:"idproveedor",
    sourceKey:"idproveedor"
})


module.exports=producto