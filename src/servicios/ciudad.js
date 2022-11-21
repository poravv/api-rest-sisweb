const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const ciudad = require("../model/model_ciudad")
const database = require('../database')
const{DataTypes}=require("sequelize")
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()


routes.get('/getsql/', verificaToken, async (req, res) => {
    const ciudades = await database.query('select * from ciudad order by descripcion asc',{type: DataTypes.SELECT})

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error ",err});
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: ciudades
            })
        }
    })
})


routes.get('/get/', verificaToken, async (req, res) => {
    
    const ciudades = await ciudad.findAll();

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error ",err});;
        } else {
            
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: ciudades
            })
        }

    })
})

routes.get('/get/:idciudad', verificaToken, async (req, res) => {
    const ciudades = await ciudad.findByPk(req.params.idciudad)
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error ",err});;
        } else {
            
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: ciudades
            });
        }


    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    
    try {
        const ciudades = await ciudad.create(req.body, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error ",err});
            } else {
                t.commit();
                console.log('Commitea')
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: ciudades
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        console.log('Rollback')
        t.rollback();
    }
})

routes.put('/put/:idciudad', verificaToken, async (req, res) => {

    const t = await database.transaction();
    try {
        const ciudades = await ciudad.update(req.body, { where: { idciudad: req.params.idciudad } }, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error ",err});
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: ciudades
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        console.log('Rollback update')
        t.rollback();
    }
})

routes.delete('/del/:idciudad', verificaToken, async (req, res) => {

    const t = await  database.transaction();
    
    try {
        const ciudades = await ciudad.destroy({ where: { idciudad: req.params.idciudad } }, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error ",err});;
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: ciudades
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        t.rollback();
    }
})


module.exports = routes;