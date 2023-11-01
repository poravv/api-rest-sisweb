const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const proveedor = require("../model/model_proveedor")
const database = require('../database');
const { QueryTypes } = require("sequelize")
//const e = require('express');
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()
let fechaActual = new Date();


routes.get('/getsql/', verificaToken, async (req, res) => {
    try {
        const proveedores = await database.query(`select * from proveedor where estado='AC'`, { type: QueryTypes.SELECT })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, })
            } else {
                res.json({
                    estado: "successfully",
                    body: proveedores
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.get('/get/', verificaToken, async (req, res) => {

    try {
        const proveedores = await proveedor.findAll()
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error" });
            } else {
                res.json({
                    estado: "successfully",
                    body: proveedores
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
    }
})

routes.get('/get/:idproveedor', verificaToken, async (req, res) => {
    try {
        const proveedores = await proveedor.findByPk(req.params.idproveedor)
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                res.json({
                    estado: "successfully",
                    body: proveedores
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
        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
            req.body.fecha_insert = strFecha;
            req.body.fecha_upd = strFecha;
            req.body.idusuario_upd = authData?.rsusuario?.idusuario;
            const proveedores = await proveedor.create(req.body, { transaction: t })
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                t.commit();
                res.json({
                    estado: 'successfully',
                    mensaje: "Registro almacenado",
                    body: proveedores
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        t.rollback();
    }

})

routes.put('/put/:idproveedor', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
            req.body.fecha_upd = strFecha;
            req.body.idusuario_upd = authData?.rsusuario?.idusuario;
            const proveedores = await proveedor.update(req.body, { where: { idproveedor: req.params.idproveedor }, transaction: t })
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                t.commit();
                res.json({
                    estado: 'successfully',
                    mensaje: "Registro actualizado",
                    body: proveedores
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        t.rollback();
    }
})

routes.delete('/del/:idproveedor', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const proveedores = await proveedor.destroy({ where: { idproveedor: req.params.idproveedor }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                t.commit();
                res.json({
                    estado: 'successfully',
                    mensaje: "Registro eliminado",
                    body: proveedores
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        t.rollback();
    }
})

module.exports = routes;