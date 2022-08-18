const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const producto = require("../model/model_producto")
const proveedor = require("../model/model_proveedor")
const database = require('../database')
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()


routes.get('/get/', verificaToken, async (req, res) => {
    const productos = await producto.findAll({ include: proveedor })

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: productos
            })
        }
    })
})

routes.get('/get/:idproducto', verificaToken, async (req, res) => {
    const productos = await producto.findByPk(req.params.idproducto, { include: proveedor })
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: productos
            })
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction()
    try {
        const productos = await producto.create(req.body, { transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: productos
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }

})

routes.put('/put/:idproducto', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const productos = await producto.update(req.body, { where: { idproducto: req.params.idproducto }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: productos
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }

})

routes.delete('/del/:idproducto', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const productos = await producto.destroy({ where: { idproducto: req.params.idproducto }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: productos
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }

})

module.exports = routes;