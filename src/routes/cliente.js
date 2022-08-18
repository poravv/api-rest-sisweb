const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const cliente = require("../model/model_cliente")
const ciudad = require("../model/model_ciudad")
const database = require('../database')
require("dotenv").config()

routes.get('/get/',verificaToken, async (req, res) => {
    const clientes = await cliente.findAll({include: ciudad},{
        transaction:t
    })
    
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
    })
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
        res.send("Error: ", error)
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
        res.send("Error: ", error)
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
        res.send("Error: ", error)
        t.rollback();
    }
    
})

//Authorization: Bearer <token>
function verificaToken(req, res, next) {
    const bearerheader = req.headers['authorization'];

    if (typeof bearerheader !== 'undefined') {
        const bearertoken = bearerheader.split(" ")[1];
        req.token = bearertoken;
        next();
    } else {
        return res.send("Error token")
    }
}

module.exports = routes;