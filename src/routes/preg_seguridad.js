const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const preg_seguridad = require("../model/model_preg_seguridad")
const usuario = require("../model/model_usuario")
const database = require('../database')

routes.get('/get/', verificaToken, async (req, res) => {
    const preg_seguridads = await preg_seguridad.findAll({ include: usuario })

    jwt.verify(req.token, 'clavesecreta', (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
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
    jwt.verify(req.token, 'clavesecreta', (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
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
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
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
        res.send("Error: ", error)
        t.rollback();
    }
})

routes.put('/put/:idpreg_seguridad', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const preg_seguridads = await preg_seguridad.update(req.body, { where: { idpreg_seguridad: req.params.idpreg_seguridad }, transaction: t })
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
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
        res.send("Error: ", error)
        t.rollback();
    }

})

routes.delete('/del/:idpreg_seguridad', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const preg_seguridads = await preg_seguridad.destroy({ where: { idpreg_seguridad: req.params.idpreg_seguridad }, transaction: t })
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
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