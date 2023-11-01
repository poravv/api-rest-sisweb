const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const persona = require("../model/model_persona")
const ciudad = require("../model/model_ciudad")
const database = require('../database');
const e = require('express');
const verificaToken = require('../middleware/token_extractor');
const { QueryTypes } = require('sequelize');
require("dotenv").config()
let fechaActual = new Date();
const Sequelize = require('sequelize');

const Op = Sequelize.Op;



routes.get('/getsql/', verificaToken, async (req, res) => {
    try {
        const personas = await database.query(`select * from vw_persona where estado='AC'`, { type: QueryTypes.SELECT })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, })
            } else {
                res.json({
                    estado: "successfully",
                    body: personas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.get('/likePersona/:documento', verificaToken, async (req, res) => {
    try {
        const rspersonas = await persona.findAll({
            where: {
                documento: {
                    [Op.like]: `${req.params.documento}%`
                }
            }
        })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });;
            } else {
                res.json({
                    estado: "successfully",
                    body: rspersonas
                });
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.get('/get/', verificaToken, async (req, res) => {
    try {
        const personas = await persona.findAll({ include: ciudad })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                res.json({
                    estado: "successfully",
                    body: personas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.get('/get/:idpersona', verificaToken, async (req, res) => {
    try {
        const personas = await persona.findByPk(req.params.idpersona, { include: ciudad })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                res.json({
                    estado: "successfully",
                    body: personas
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
        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
                req.body.fecha_insert = strFecha;
                req.body.fecha_upd = strFecha;
                req.body.idusuario_upd = authData?.rsusuario?.idusuario;
                const personas = await persona.create(req.body, { transaction: t })
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro almacenado correctamente",
                    body: personas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error });
        t.rollback();
    }

})

routes.put('/put/:idpersona', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {

        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
                req.body.fecha_upd = strFecha;
                req.body.idusuario_upd = authData?.rsusuario?.idusuario;
                const personas = await persona.update(req.body, { where: { idpersona: req.params.idpersona }, transaction: t })
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro actualizado correctamente",
                    body: personas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error });
        t.rollback();
    }

})

routes.delete('/del/:idpersona', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const personas = await persona.destroy({ where: { idpersona: req.params.idpersona }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro eliminado",
                    body: personas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error });
        t.rollback();
    }

})


module.exports = routes;