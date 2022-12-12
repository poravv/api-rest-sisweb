const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const producto_final = require("../model/model_producto_final")
const receta = require("../model/model_receta")
const database = require('../database')
const{DataTypes}=require("sequelize")
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()


routes.get('/getsql/', verificaToken, async (req, res) => {
    const producto_finales = await database.query('select * from producto_final order by nombre asc',{type: DataTypes.SELECT})

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error"});
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: producto_finales
            })
        }
    })
});

routes.get('/productoventa/:idsucursal', verificaToken, async (req, res) => {
    try {
            const producto_finales = await database.query(`select * from vw_venta_prod_stock where estado ='AC' and idsucursal=${req.params.idsucursal} order by nombre asc`,
    {
        model: producto_final,
        mapToModel: true // pass true here if you have any mapped fields
    }
    ,{type: DataTypes.SELECT});
 
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error"});
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: producto_finales
            })
        }
    })
    } catch (error) {
        res.json({error: "error catch"});
    }
});

routes.get('/get/', verificaToken, async (req, res) => {
    
    try {
        const producto_finales = await producto_final.findAll({
            include: [
                { model: receta },
            ]
        });

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error"});;
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: producto_finales
            })
        }
    }) 
    } catch (error) {
        console.log(error)
    } 
})

routes.get('/get/:idproducto_final', verificaToken, async (req, res) => {
    const producto_finales = await producto_final.findByPk(req.params.idproducto_final)
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error"});;
        } else {
            
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: producto_finales
            });
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    
    try {
        const producto_finales = await producto_final.create(req.body, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error"});
            } else {
                t.commit();
                //console.log('Commitea')
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: producto_finales
                })
            }
        })
    } catch (error) {
        res.json({
            error: "Error en el registro"
        });
        //console.log('Rollback')
        t.rollback();
    }
})

routes.put('/put/:idproducto_final', verificaToken, async (req, res) => {

    const t = await database.transaction();
    try {
        const producto_finales = await producto_final.update(req.body, { where: { idproducto_final: req.params.idproducto_final } }, {
            transaction: t
        });

        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            
            if (err) {
                t.rollback();
                res.send("Error autenticacion: ", err);
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: producto_finales
                })
            }
        });

    } catch (error) {
        res.send("Error catch: ", error);
    }
})

routes.put('/inactiva/:idproducto_final', verificaToken, async (req, res) => {
    
    const t = await database.transaction();
    console.log("Entra en inactiva",req.params.idproducto_final);

    try {
        const queryDet = `update producto_final set estado='IN' where idproducto_final = ${req.params.idproducto_final}`;
        await database.query(queryDet, {
            transaction: t
        });

        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error"});
            } else {
                t.commit();
                res.json({
                    mensaje: "Success",
                    authData: authData
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({error: "error catch"});;
    }
})

routes.delete('/del/:idproducto_final', verificaToken, async (req, res) => {

    const t = await  database.transaction();
    
    try {
        const producto_finales = await producto_final.destroy({ where: { idproducto_final: req.params.idproducto_final } }, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error"});;
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: producto_finales
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        t.rollback();
    }
})


module.exports = routes;