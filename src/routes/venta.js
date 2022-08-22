const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const venta = require("../model/model_venta")
const usuario = require("../model/model_usuario")
const cliente = require("../model/model_cliente")
//const detventa = require("../model/model_detventa")
const database = require('../database');

routes.get('/get/', verificaToken, async (req, res) => {
    const ventas = await venta.findAll({
        include: [
            { model: usuario },
            { model: cliente }
        ]
    })

    jwt.verify(req.token, 'clavesecreta', (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: ventas
            })
        }
    })
})

routes.get('/get/:idventa', verificaToken, async (req, res) => {
    const ventas = await venta.findByPk(req.params.idventa, {
        include: [
            { model: usuario },
            { model: cliente }
        ]
    })
    jwt.verify(req.token, 'clavesecreta', (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: ventas
            })
        }
    })
})

routes.get('/getDet/', verificaToken, async (req, res) => {
    const ventas = await venta.findAll({
        include: [
            { model: usuario },
            { model: cliente },
            //{model:detventa},
        ]
    })

    jwt.verify(req.token, 'clavesecreta', (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: ventas
            })
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const ventas = await venta.create(req.body, { transaction: t })
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: ventas
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }

})

routes.put('/put/:idventa', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const ventas = await venta.update(req.body, { where: { idventa: req.params.idventa }, transaction: t })
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: ventas
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }

})

routes.delete('/del/:idventa', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const ventas = await venta.destroy({ where: { idventa: req.params.idventa }, transaction: t })
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.transaction()
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: ventas
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