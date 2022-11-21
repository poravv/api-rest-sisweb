const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const cliente = require("../model/model_cliente")
const ciudad = require("../model/model_ciudad")
const database = require('../database')
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()

routes.get('/get/',verificaToken, async (req, res) => {
    
    try {
        const clientes = await cliente.findAll({include: ciudad});
    
    jwt.verify(req.token,process.env.CLAVESECRETA,(err,authData)=>{
        if(err){
            return res.send("Error: ",err)
        }else{
            res.json({
                mensaje:"successfully",
                authData:authData,
                body:clientes
            })
        }  
    });
    } catch (error) {
        console.log('Error: ',error)
    }
})

routes.get('/get/:idcliente',verificaToken, async (req, res) => {
    const clientes = await cliente.findByPk(req.params.idcliente,{include: ciudad})
    jwt.verify(req.token,process.env.CLAVESECRETA,(err,authData)=>{
        if(err) return res.send("Error: ",err)
        res.json({
            mensaje:"successfully",
            authData:authData,
            body:clientes
        })
    })
})

routes.post('/post/',verificaToken, async (req, res) => {
    
    const t = await database.transaction();
    try {
        const clientes = await cliente.create(req.body,{
            transaction:t
        });
        jwt.verify(req.token,process.env.CLAVESECRETA,(err,authData)=>{
            if(err){
                return res.send("Error: ",err)
            }else{
                t.commit();
                res.json({
                    mensaje:"Registro almacenado",
                    authData:authData,
                    body:clientes
                })
            }
        })
    } catch (error) {
        res.json({
            error:"Error en el registro",
        })
        t.rollback();
    }
    
})

routes.put('/put/:idcliente',verificaToken, async (req, res) => {
    
    const t = await database.transaction();
    try {
        const clientes = await cliente.update(req.body, { where: { idcliente: req.params.idcliente } },{
            transaction:t
        });
        jwt.verify(req.token,process.env.CLAVESECRETA,(err,authData)=>{
            if(err){
                return res.send("Error: ",err)
            }else{
                t.commit();
                res.json({
                    mensaje:"Registro actualizado",
                    authData:authData,
                    body:clientes
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        t.rollback();
    }
    
})

routes.delete('/del/:idcliente',verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const clientes = await cliente.destroy({ where: { idcliente: req.params.idcliente } },{
            transaction:t
        });
        jwt.verify(req.token,process.env.CLAVESECRETA,(err,authData)=>{
            if(err){
                return res.send("Error: ",err)
            }else{
                t.commit();
                res.json({
                    mensaje:"Registro eliminado",
                    authData:authData,
                    body:clientes
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        t.rollback();
    }
    
})

module.exports = routes;