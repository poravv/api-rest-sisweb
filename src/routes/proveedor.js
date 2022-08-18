const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const proveedor = require("../model/model_proveedor")
const database = require('../database');
//const e = require('express');
require("dotenv").config()

routes.get('/get/', verificaToken, async (req, res) => {
    const proveedors = await proveedor.findAll()

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: proveedors
            })
        }
    })
})

routes.get('/get/:idproveedor', verificaToken, async (req, res) => {
    const proveedors = await proveedor.findByPk(req.params.idproveedor)
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: proveedors
            })
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const proveedors = await proveedor.create(req.body, { transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: proveedors
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }

})

routes.put('/put/:idproveedor', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const proveedors = await proveedor.update(req.body, { where: { idproveedor: req.params.idproveedor }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: proveedors
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }
})

routes.delete('/del/:idproveedor', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const proveedors = await proveedor.destroy({ where: { idproveedor: req.params.idproveedor }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: proveedors
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