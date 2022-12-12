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
        console.log(req.body)
        const { nick, password } = req.body;

        //console.log(md5(password));

        /*
        let rsusuario = await database.query(`select * from usuario where nick = '${nick}' and password = '${md5(password)}'`,
            {
                model: usuario,
                mapToModel: true, // pass true here if you have any mapped fields
                include: [
                    { model: sucursal },
                    { model: persona }
                ]

            }
        );
        */

        const rsusuario = await usuario.findOne(
        {where: { nick: nick,password: md5(password) },
            include: [
                { model: sucursal },
                { model: persona }
            ]
        })

        await database.query('CALL cargaInventarioCab(@a)');

        //console.log(rsusuario);
        //console.log(rsusuario.length);

        if (rsusuario.length != 0) {

            jwt.sign({ rsusuario }, process.env.CLAVESECRETA
                , { expiresIn: '12h' }//Para personalizar el tiempo para expirar
                , (err, token) => {
                    return res.json({
                        "error": "false",
                        token,
                        body: rsusuario
                    });
                });

        } else {
            return res.status(400).json(
                {
                    "error": "true",
                    "mensaje": "Usuario no existe"
                }
            );
        }
    } catch (error) {
        return res.status(400).json(
            {
                "error": "true",
                "mensaje": "Error de login"
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

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({ error: "Error ", err });
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: usuarios
            })
        }
    })

    //res.json(usuarios)
})

routes.get('/get/:idusuario', verificaToken, async (req, res) => {
    const usuarios = await usuario.findByPk(req.params.idusuario, {
        include: [
            { model: sucursal },
            { model: persona }
        ]
    })
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({ error: "Error ", err });
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: usuarios
            })
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const usuarios = await usuario.create(req.body, { transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({ error: "Error ", err });
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: usuarios
                })
            }
        })
    } catch (error) {
        res.json({ error: "error catch" });
        t.rollback();
    }

})

routes.put('/put/:idusuario', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const usuarios = await usuario.update(req.body, { where: { idusuario: req.params.idusuario }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({ error: "Error ", err });
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: usuarios
                })
            }
        })
    } catch (error) {
        res.json({ error: "error catch" });
        t.rollback();
    }

})

routes.delete('/del/:idusuario', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const usuarios = await usuario.destroy({ where: { idusuario: req.params.idusuario }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({ error: "Error ", err });
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: usuarios
                })
            }
        })
    } catch (error) {
        res.json({ error: "error catch" });
        t.rollback();
    }
})


module.exports = routes;