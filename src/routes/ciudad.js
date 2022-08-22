const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const ciudad = require("../model/model_ciudad")
const database = require('../database')
const{DataTypes}=require("sequelize")


routes.get('/getsql/', verificaToken, async (req, res) => {
    const ciudades = await database.query('select * from ciudad order by descripcion asc',{type: DataTypes.SELECT})

    jwt.verify(req.token, 'clavesecreta', (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
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

    jwt.verify(req.token, 'clavesecreta', (err, authData) => {
        if (err) {
            return res.send("Error: ", err);
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
    jwt.verify(req.token, 'clavesecreta', (err, authData) => {
        if (err) {
            return res.send("Error: ", err);
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
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
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
        res.send("Error: ", error)
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
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
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
        res.send("Error: ", error)
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
        jwt.verify(req.token, 'clavesecreta', (err, authData) => {
            if (err) {
                return res.send("Error: ", err);
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