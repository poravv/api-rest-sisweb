const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const det_inventario = require("../model/model_detinventario")
const inventario = require("../model/model_inventario")
const database = require('../database')

routes.get('/get/', verificaToken, async (req, res) => {
    const det_inventarios = await det_inventario.findAll({
        include: [
            { model: inventario }
        ]
    })

    jwt.verify(req.token, 'clavesecreta', (err, authData) => {
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
    jwt.verify(req.token, 'clavesecreta', (err, authData) => {
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
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
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
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
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
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
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

//Authorization: Bearer <token>
function verificaToken(req, res, next) {
    const bearerheader = req.headers['authorization'];

    if (typeof bearerheader !== 'undefined') {
        const bearertoken = bearerheader.split(" ")[1];
        req.token = bearertoken;
        next();
    } else{
        return res.send("Error token")
    }
}

module.exports = routes;