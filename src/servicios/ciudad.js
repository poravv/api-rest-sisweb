const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const ciudad = require("../model/model_ciudad")
const database = require('../database')
const { QueryTypes } = require("sequelize")
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()

routes.get('/getsql/', verificaToken, async (req, res) => {
    try {
        const ciudades = await database.query('select * from ciudad order by descripcion asc', { type: QueryTypes.SELECT })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({estado: "error",mensaje:error,})
            } else {
                res.json({
                    estado: "successfully",
                    body: ciudades
                })
            }
        })
    } catch (error) {
        res.json({estado: "error",mensaje: error, })
    }
})


routes.get('/get/', verificaToken, async (req, res) => {

    try {
        const ciudades = await ciudad.findAll();
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({estado: "error",mensaje:error,});
            } else {
                res.json({
                    estado: "successfully",
                    body: ciudades
                })
            }
        })
    } catch (error) {
        res.json({estado: "error",mensaje: error,})
    }
})

routes.get('/get/:idciudad', verificaToken, async (req, res) => {
    try {
        
        const ciudades = await ciudad.findByPk(req.params.idciudad)
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({estado: "error",mensaje:error,});
            } else {
                res.json({
                    estado: "successfully",
                    body: ciudades
                });
            }
        })
    } catch (error) {
        res.json({estado: "error",mensaje:error});
    }
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const ciudades = await ciudad.create(req.body, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({estado: "error",mensaje:error,});
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje:'Registro almacenado correctamente',
                    body: ciudades
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({estado: "error",mensaje:error,});
    }
})

routes.put('/put/:idciudad', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const ciudades = await ciudad.update(req.body, { where: { idciudad: req.params.idciudad } }, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({estado: "error",mensaje:error,})
            } else {
                t.commit();
                res.json({
                    estado:'successfully',
                    mensaje: "Registro actualizado correctamente",
                    authData: authData,
                    body: ciudades
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({estado: "error",mensaje:error,})
    }
})

routes.delete('/del/:idciudad', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const ciudades = await ciudad.destroy({ where: { idciudad: req.params.idciudad } }, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({estado: "error",mensaje:error,});
            } else {
                t.commit();
                res.json({
                    estado:"successfully",
                    mensaje: "Registro eliminado",
                    body: ciudades
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({estado: "error",mensaje:error,})
    }
})


module.exports = routes;