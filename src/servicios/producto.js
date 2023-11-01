const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const producto = require("../model/model_producto")
const proveedor = require("../model/model_proveedor")
const database = require('../database')
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()
let fechaActual = new Date();

routes.get('/get/', verificaToken, async (req, res) => {

    try {
        const productos = await producto.findAll({ include: proveedor })

        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: 'error', mensjae: error });
            } else {
                res.json({
                    estado: "successfully",
                    body: productos
                })
            }
        })
    } catch (error) {
        res.json({ estado: 'error', mensjae: error });
    }

})

routes.get('/get/:idproducto', verificaToken, async (req, res) => {
    const productos = await producto.findByPk(req.params.idproducto, { include: proveedor })
    jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
        if (error) {
            res.json({ estado: 'error', mensjae: error });
        } else {
            res.json({
                estado: "successfully",
                body: productos
            })
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    console.log('Entra en producto------------------------------------------')
    const t = await database.transaction();
    try {
        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: 'error', mensjae: error });
            } else {
                const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
                req.body.fecha_insert = strFecha;
                req.body.fecha_upd = strFecha;
                req.body.idusuario_upd = authData?.rsusuario?.idusuario;
                const productos = await producto.create(req.body)
                await database.query('CALL cargaInventarioCab(@a)');
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro almacenado",
                    body: productos
                })
            }
        })
    } catch (error) {
        t.rollback();
        return res.json({ estado: "error", mensaje: error })
    }

})

routes.put('/put/:idproducto', verificaToken, async (req, res) => {

    //console.log(req.body)
    try {

        const t = await database.transaction();


        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: 'error', mensjae: error });
            } else {
                const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
                req.body.fecha_upd = strFecha;
                req.body.idusuario_upd = authData?.rsusuario?.idusuario;
                const productos = await producto.update(req.body, { where: { idproducto: req.params.idproducto }, transaction: t })
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro actualizado",
                    body: productos
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        //t.rollback();
    }

})

routes.delete('/del/:idproducto', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const productos = await producto.destroy({ where: { idproducto: req.params.idproducto }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: 'error', mensjae: error });
            } else {
                res.json({
                    estado: "successfully",
                    mensaje: "Registro eliminado",
                    body: productos
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        t.rollback();
    }

})

module.exports = routes;