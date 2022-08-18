const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const inventario = require("../model/model_inventario")
const sucursal = require("../model/model_sucursal")
const producto = require("../model/model_producto")
const detinventario = require("../model/model_detinventario")
const database = require('../database')
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()

routes.get('/get/', verificaToken, async (req, res) => {
    const inventarios = await inventario.findAll({
        include: [
            { model: sucursal },
            { model: producto }
        ]
    })

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: inventarios
            })
        }
    })
})

routes.get('/get/:idinventario', verificaToken, async (req, res) => {
    const inventarios = await inventario.findByPk(req.params.idinventario, {
        include: [
            { model: sucursal },
            { model: producto }
        ]
    })
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: inventarios
            })
        }
    })
})

routes.get('/getDet/', verificaToken, async (req, res) => {
    const inventarios = await inventario.findAll({
        include: [
            { model: sucursal },
            { model: producto },
            { model: detinventario },
        ]
    })

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: inventarios
            })
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const inventarios = await inventario.create(req.body, { transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: inventarios
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }

})

routes.put('/put/:idinventario', verificaToken, async (req, res) => {
    const t = database.transaction();
    try {
        const inventarios = await inventario.update(req.body, { where: { idinventario: req.params.idinventario }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: inventarios
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }

})

routes.delete('/del/:idinventario', verificaToken, async (req, res) => {
    const t = await database.transaction();

    try {
        const inventarios = await inventario.destroy({ where: { idinventario: req.params.idinventario }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: inventarios
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }

})

module.exports = routes;