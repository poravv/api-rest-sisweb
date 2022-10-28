const{DataTypes}=require("sequelize")
const sequelize=require("../database")

const det_inventario=sequelize.define("det_inventario",{
    iddet_inventario:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    cantidad:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    estado:{
        type:DataTypes.STRING,
        //allowNull: false
    },
    fecha_insert:{
        type:DataTypes.DATE,
        //allowNull:false
    },
    idinventario:{
        type:DataTypes.INTEGER,
        //allowNull:false
    },
    fecha_upd:{
        type:DataTypes.DATE,
        //allowNull:false
    }
},{
    tableName:"Det_inventario",
    timestamps:false
})

module.exports=det_inventario