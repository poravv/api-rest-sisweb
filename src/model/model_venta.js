const{DataTypes}=require("sequelize")
const sequelize=require("../database")
const cliente=require("./model_cliente")
const usuario=require("./model_usuario")
const det_venta=require("./model_detventa")

const venta=sequelize.define("ventas",{
    idventa:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    nro_comprobante:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    fecha:{
        type:DataTypes.DATE,
        allowNull:false
    },
    iva_total:{
        type:DataTypes.DECIMAL(13.2),
        allowNull:false
    },
    total:{
        type:DataTypes.DECIMAL(13.2),
        allowNull:false
    },
    estado:{
        type:DataTypes.STRING,
        allowNull:false
    },
    idcliente:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    idusuario:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    tableName:"Venta",
    timestamps:false
})

venta.hasOne(cliente,{
    foreignKey:"idcliente",
    sourceKey:"idcliente"
})

venta.hasOne(usuario,{
    foreignKey:"idusuario",
    sourceKey:"idusuario"
})

venta.hasMany(det_venta,{
    foreignKey:"idventa",
    sourceKey:"idventa"
})


module.exports=venta