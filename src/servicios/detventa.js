const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const det_venta = require("../model/model_detventa")
const verificaToken = require('../middleware/token_extractor')
const database = require('../database')
require("dotenv").config()

routes.get('/get/', verificaToken, async (req, res) => {
    try {
        const det_ventas = await det_venta.findAll()

        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error })
            } else {
                res.json({
                    estado: "successfully",
                    body: det_ventas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
    }
})

routes.get('/get/:idventa', verificaToken, async (req, res) => {
    try {
        const det_ventas = await det_venta.findAll({ where: { idventa: req.params.idventa } }, {
            //include:[
            //    {model:venta},
            //]
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error })
            } else {
                res.json({
                    estado: "successfully",
                    body: det_ventas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
    }
})

routes.get('/getDet/', verificaToken, async (req, res) => {
    try {
        const det_ventas = await det_venta.findAll()
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error })
            } else {
                res.json({
                    estado: "successfully",
                    body: det_ventas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
    }
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const det_ventas = await det_venta.create(req.body, {
            transaction: t
        })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error })
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro almacenado correctamente",
                    body: det_ventas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        t.rollback();
    }

})

routes.put('/put/:iddet_venta', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const det_ventas = await det_venta.update(req.body, { where: { iddet_venta: req.params.iddet_venta }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) res.json({ estado: "error", mensaje: error })

            res.json({
                estado: "successfully",
                mensaje: "Registro actualizado correctamente",
                body: det_ventas
            })
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        t.rollback();
    }
})

routes.delete('/del/:iddet_venta', verificaToken, async (req, res) => {
    const t = await database.transaction();

    try {
        const det_ventas = await det_venta.destroy({ where: { iddet_venta: req.params.iddet_venta, transaction: t } })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) res.json({ estado: "error", mensaje: error })

            res.json({
                estado: "successfully",
                mensaje: "Registro eliminado",
                body: det_ventas
            })
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        t.rollback();
    }
})

module.exports = routes;