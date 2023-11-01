const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const usuario = require("../model/model_usuario")
const sucursal = require("../model/model_sucursal")
const persona = require("../model/model_persona")
const database = require('../database')
const verificaToken = require('../middleware/token_extractor')
const md5 = require('md5')
require("dotenv").config()

routes.post('/login/', async (req, res) => {
    //console.log(`select * from usuario where nick = '${nick}' and password = '${md5(password)}'`)
    try {
        //console.log(req.body)
        const { nick, password } = req.body;
        const rsusuario = await usuario.findOne(
            {
                where: { nick: nick, password: md5(password) },
                include: [
                    { model: sucursal },
                    { model: persona }
                ]
            })
        await database.query('CALL cargaInventarioCab(@a)');

        if (rsusuario.length != 0) {

            console.log('Mi usuario: ', rsusuario)

            jwt.sign({ rsusuario }, process.env.CLAVESECRETA
                , { expiresIn: '12h' }//Para personalizar el tiempo para expirar
                , (error, token) => {
                    res.json({ estado: "succesfully", token, body: rsusuario })
                });

        } else {
            return res.status(400).json(
                {
                    estado: "error",
                    mensaje: "Usuario no existe"
                }
            );
        }
    } catch (error) {
        return res.status(400).json(
            {
                estado: "error",
                mensaje: "Error de login"
            }
        );
    }
})

routes.get('/get/', verificaToken, async (req, res) => {
    const usuarios = await usuario.findAll({
        include: [
            { model: sucursal },
            { model: persona }
        ]
    })

    jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
        if (error) {
            res.json({ estado: "error", mensaje: error });
        } else {
            res.json({
                estado: "successfully",
                body: usuarios
            })
        }
    })
})

routes.get('/get/:idusuario', verificaToken, async (req, res) => {
    const usuarios = await usuario.findByPk(req.params.idusuario, {
        include: [
            { model: sucursal },
            { model: persona }
        ]
    })
    jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
        if (error) {
            res.json({ estado: "error", mensaje: error });
        } else {
            res.json({
                estado: "successfully",
                body: usuarios
            })
        }
    })
})


routes.put('/reset/:idusuario', verificaToken, async (req, res) => {
    const t = await database.transaction();
    //console.log(req.body)
    req.body.password = md5(req.body.password);
    try {
        await usuario.update(req.body, { where: { idusuario: req.params.idusuario }, transaction: t }).then((rs) => {
            //console.log('RS: ', rs)
            jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
                if (error) {
                    res.json({ estado: "error", mensaje: error });
                } else {
                    t.commit();
                    res.json({
                        estado: "successfully",
                        mensaje: "Usuario actualizado correctamente",
                        body: rs
                    })
                }
            })
        });

    } catch (error) {
        res.json({ estado: "error", mensaje: error });
        t.rollback();
    }
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();

    try {

        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                req.body.password = md5(req.body.password);
                const usuarios = await usuario.create(req.body, { transaction: t })
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro almacenado",
                    body: usuarios
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error });
        t.rollback();
    }

})

routes.put('/put/:idusuario', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const usuarios = await usuario.update(req.body, { where: { idusuario: req.params.idusuario }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro actualizado",
                    body: usuarios
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error });
        t.rollback();
    }

})

routes.delete('/del/:idusuario', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const usuarios = await usuario.destroy({ where: { idusuario: req.params.idusuario }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro eliminado",
                    body: usuarios
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error });
        t.rollback();
    }
})


module.exports = routes;