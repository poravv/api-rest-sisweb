const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const ciudad = require('../model/model_ciudad');
const sucursal = require("../model/model_sucursal")
const database = require('../database');
const { QueryTypes } = require("sequelize")
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()

routes.get('/getsql/', verificaToken, async (req, res) => {
    try {
        const sucursales = await database.query('select * from vw_sucursal', { type: QueryTypes.SELECT })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, })
            } else {
                res.json({
                    estado: "successfully",
                    body: sucursales
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})


routes.get('/get/', verificaToken, async (req, res) => {
    try {
        const sucursales = await sucursal.findAll({ include: ciudad })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ error: "Error ", error });
            } else {
                res.json({
                    estado: "successfully",
                    body: sucursales
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.get('/get/:idsucursal', verificaToken, async (req, res) => {
    try {
        const sucursales = await sucursal.findByPk(req.params.idsucursal, { include: ciudad })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ error: "Error ", error });
            } else {
                res.json({
                    estado:"successfully",
                    body: sucursales
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const sucursales = await sucursal.create(req.body, { transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ error: "Error ", error });
            } else {
                t.commit();
                res.json({
                    estado:"successfully",
                    mensaje: "Registro almacenado correctamente",
                    body: sucursales
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.put('/put/:idsucursal', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const sucursales = await sucursal.update(req.body, { where: { idsucursal: req.params.idsucursal }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ error: "Error ", error });
            } else {
                t.commit();
                res.json({
                    estado:"successfully",
                    mensaje: "Registro actualizado correctamente",
                    body: sucursales
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.delete('/del/:idsucursal', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const sucursales = await sucursal.destroy({ where: { idsucursal: req.params.idsucursal }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ error: "Error ", error });
            } else {
                t.commit();
                res.json({
                    estado:"successfully",
                    mensaje: "Registro eliminado",
                    body: sucursales
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({ estado: "error", mensaje: error, })
    }
})

module.exports = routes;