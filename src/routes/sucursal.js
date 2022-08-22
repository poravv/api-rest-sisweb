const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const ciudad = require('../model/model_ciudad');
const sucursal = require("../model/model_sucursal")
const database = require('../database');

routes.get('/get/', verificaToken, async (req, res) => {
    const sucursales = await sucursal.findAll({ include: ciudad })
    jwt.verify(req.token, 'clavesecreta', (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: sucursales
            })
        }
    })
})

routes.get('/get/:idsucursal', verificaToken, async (req, res) => {
    const sucursales = await sucursal.findByPk(req.params.idsucursal, { include: ciudad })
    jwt.verify(req.token, 'clavesecreta', (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: sucursales
            })
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const sucursales = await sucursal.create(req.body, { transaction: t })
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: sucursales
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }

})

routes.put('/put/:idsucursal', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const sucursales = await sucursal.update(req.body, { where: { idsucursal: req.params.idsucursal }, transaction: t })
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: sucursales
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }
})

routes.delete('/del/:idsucursal', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const sucursales = await sucursal.destroy({ where: { idsucursal: req.params.idsucursal }, transaction: t })
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: sucursales
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
    } else return res.send("Error token")
}

module.exports = routes;