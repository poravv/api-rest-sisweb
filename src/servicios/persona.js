const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const persona = require("../model/model_persona")
const ciudad = require("../model/model_ciudad")
const database = require('../database');
const e = require('express');
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()

routes.get('/get/', verificaToken, async (req, res) => {
    const personas = await persona.findAll({ include: ciudad })
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error ",err});
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: personas
            })
        }
    })
})

routes.get('/get/:idpersona', verificaToken, async (req, res) => {
    const personas = await persona.findByPk(req.params.idpersona, { include: ciudad })
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error ",err});
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: personas
            })
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();

    try {
        const personas = await persona.create(req.body, { transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error ",err});
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: personas
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        t.rollback();
    }

})

routes.put('/put/:idpersona', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const personas = await persona.update(req.body, { where: { idpersona: req.params.idpersona }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error ",err});
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: personas
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        t.rollback();
    }

})

routes.delete('/del/:idpersona', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const personas = await persona.destroy({ where: { idpersona: req.params.idpersona }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error ",err});
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: personas
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        t.rollback();
    }

})


module.exports = routes;