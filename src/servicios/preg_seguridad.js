const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const preg_seguridad = require("../model/model_preg_seguridad")
const usuario = require("../model/model_usuario")
const database = require('../database')
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()

routes.get('/get/', verificaToken, async (req, res) => {
    const preg_seguridads = await preg_seguridad.findAll({ include: usuario })

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error ",err});
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: preg_seguridads
            })
        }
    })
})

routes.get('/get/:idpreg_seguridad', verificaToken, async (req, res) => {
    const preg_seguridads = await preg_seguridad.findByPk(req.params.idpreg_seguridad, { include: usuario })
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error ",err});
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: preg_seguridads
            })
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const preg_seguridads = await preg_seguridad.create(req.body, { transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error ",err});
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: preg_seguridads
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        t.rollback();
    }
})

routes.put('/put/:idpreg_seguridad', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const preg_seguridads = await preg_seguridad.update(req.body, { where: { idpreg_seguridad: req.params.idpreg_seguridad }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error ",err});
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: preg_seguridads
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        t.rollback();
    }

})

routes.delete('/del/:idpreg_seguridad', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const preg_seguridads = await preg_seguridad.destroy({ where: { idpreg_seguridad: req.params.idpreg_seguridad }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error ",err});
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: preg_seguridads
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        t.rollback();
    }
})

module.exports = routes;