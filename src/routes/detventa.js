const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const det_venta = require("../model/model_detventa")
const venta = require("../model/model_venta")
const inventario = require("../model/model_inventario")
const verificaToken = require('../middleware/token_extractor')
const database = require('../database')
require("dotenv").config()

routes.get('/get/',verificaToken, async (req, res) => {
    const det_ventas = await det_venta.findAll({
        include:[
            {model:venta},
            {model:inventario}
        ]
    })
    
    jwt.verify(req.token,process.env.CLAVESECRETA,(err,authData)=>{
        if(err){
            return res.send("Error: ",err)
        }else{
            res.json({
                mensaje:"successfully",
                authData:authData,
                body:det_ventas
            })
        }
    })
})

routes.get('/get/:iddet_venta',verificaToken, async (req, res) => {
    const det_ventas = await det_venta.findByPk(req.params.iddet_venta,{
        include:[
            {model:venta},
            {model:inventario}
        ]
    })
    jwt.verify(req.token,process.env.CLAVESECRETA,(err,authData)=>{
        if(err){
            return res.send("Error: ",err)
        }else{
            res.json({
                mensaje:"successfully",
                authData:authData,
                body:det_ventas
            })
        }
    })
})

routes.get('/getDet/',verificaToken, async (req, res) => {
    const det_ventas = await det_venta.findAll({
        include:[
            {model:venta},
            {model:inventario},
            //{model:detdet_venta},
        ]
    })
    jwt.verify(req.token,process.env.CLAVESECRETA,(err,authData)=>{
        if(err){
            return res.send("Error: ",err)
        }else{
            res.json({
                mensaje:"successfully",
                authData:authData,
                body:det_ventas
            })
        }
    })
})

routes.post('/post/',verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const det_ventas = await det_venta.create(req.body,{
            transaction:t
        })
        jwt.verify(req.token,process.env.CLAVESECRETA,(err,authData)=>{
            if(err) {
                return res.send("Error: ",err)
            }else{
                t.commit();
                res.json({
                    mensaje:"Registro almacenado",
                    authData:authData,
                    body:det_ventas
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }
    
})

routes.put('/put/:iddet_venta',verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const det_ventas = await det_venta.update(req.body, { where: { iddet_venta: req.params.iddet_venta },transaction:t})
        jwt.verify(req.token,process.env.CLAVESECRETA,(err,authData)=>{
            if(err) return res.send("Error: ",err)
    
            res.json({
                mensaje:"Registro actualizado",
                authData:authData,
                body:det_ventas
            })
        })    
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }
})

routes.delete('/del/:iddet_venta',verificaToken, async (req, res) => {
    const t = await database.transaction();

    try {
        const det_ventas = await det_venta.destroy({ where: { iddet_venta: req.params.iddet_venta ,transaction:t}})
        jwt.verify(req.token,process.env.CLAVESECRETA,(err,authData)=>{
            if(err) return res.send("Error: ",err)
    
            res.json({
                mensaje:"Registro eliminado",
                authData:authData,
                body:det_ventas
            })
        })   
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }
})

module.exports = routes;