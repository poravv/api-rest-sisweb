const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const det_inventario = require("../model/model_detinventario")
const inventario = require("../model/model_inventario")
const database = require('../database')
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()

routes.get('/get/', verificaToken, async (req, res) => {
    const det_inventarios = await det_inventario.findAll({
        include: [
            { model: inventario }
        ]
    })

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: det_inventarios
            })
        }
    })
})

routes.get('/get/:iddet_inventario', verificaToken, async (req, res) => {
    const det_inventarios = await det_inventario.findByPk(req.params.iddet_inventario, {
        include: [
            { model: inventario },
        ]
    })
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err){
            return res.send("Error: ", err)
        }else{
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: det_inventarios
            })
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const det_inventarios = await det_inventario.create(req.body,{
            transaction:t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            }else {
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: det_inventarios
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }
    
})

routes.put('/put/:iddet_inventario', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const det_inventarios = await det_inventario.update(req.body, { where: { iddet_inventario: req.params.iddet_inventario } },{
            transaction:t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err){
                return res.send("Error: ", err)
            }else{
                t.commit();
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: det_inventarios
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }
    
})

routes.delete('/del/:iddet_inventario', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const det_inventarios = await det_inventario.destroy({ where: { iddet_inventario: req.params.iddet_inventario } },{
            transaction:t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err){
                return res.send("Error: ", err)
            }else{
                t.commit();
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: det_inventarios
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }
    
})

module.exports = routes;