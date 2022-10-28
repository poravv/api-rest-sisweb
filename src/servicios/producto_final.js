const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const producto_final = require("../model/model_producto_final")
const database = require('../database')
const{DataTypes}=require("sequelize")
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()


routes.get('/getsql/', verificaToken, async (req, res) => {
    const producto_finales = await database.query('select * from producto_final order by nombre asc',{type: DataTypes.SELECT})

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: producto_finales
            })
        }
    })
})


routes.get('/get/', verificaToken, async (req, res) => {
    
    const producto_finales = await producto_final.findAll();

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err);
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: producto_finales
            })
        }
    })
})

routes.get('/get/:idproducto_final', verificaToken, async (req, res) => {
    const producto_finales = await producto_final.findByPk(req.params.idproducto_final)
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err);
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
                return res.send("Error: ", err)
            } else {
                t.commit();
                console.log('Commitea')
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: producto_finales
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        console.log('Rollback')
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
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: producto_finales
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        console.log('Rollback update')
        t.rollback();
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
                return res.send("Error: ", err);
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
        res.send("Error: ", error)
        t.rollback();
    }
})


module.exports = routes;