const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const persona = require("../model/model_persona")
const ciudad = require("../model/model_ciudad")
const database = require('../database');
const e = require('express');
require("dotenv").config()

routes.get('/get/', verificaToken, async (req, res) => {
    const personas = await persona.findAll({ include: ciudad })
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
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
            return res.send("Error: ", err)
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
                return res.send("Error: ", err)
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
        res.send("Error: ", error)
        t.rollback();
    }

})

routes.put('/put/:idpersona', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const personas = await persona.update(req.body, { where: { idpersona: req.params.idpersona }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
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
        res.send("Error: ", error)
        t.rollback();
    }

})

routes.delete('/del/:idpersona', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const personas = await persona.destroy({ where: { idpersona: req.params.idpersona }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
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