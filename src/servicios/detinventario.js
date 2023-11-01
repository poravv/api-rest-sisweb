const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const det_inventario = require("../model/model_detinventario")
const inventario = require("../model/model_inventario")
const database = require('../database')
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()

routes.get('/get/', verificaToken, async (req, res) => {
    try {
        const det_inventarios = await det_inventario.findAll({});

        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({ error: "Error" });
            } else {
                res.json({
                    mensaje: "successfully",
                    authData: authData,
                    body: det_inventarios
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.json({ error: "Error" });
    }
});

routes.get('/get/:idinventario', verificaToken, async (req, res) => {
    try {

        if (req.params.idinventario) {
            //const det_inventarios = await det_inventario.findByPk(req.params.idinventario);
            const query = `select * from det_inventario where idinventario = ${req.params.idinventario} and estado ='AC'`;
            const det_inventarios = await database.query(query,
                {
                    model: det_inventario,
                    mapToModel: true // pass true here if you have any mapped fields
                });

            //console.log(det_inventarios);

            jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
                if (err) {
                    res.json({ error: "Error" });
                } else {
                    res.json({
                        mensaje: "successfully",
                        authData: authData,
                        body: det_inventarios
                    })
                }
            })
        } else {
            res.send("Error idinventario null")
        }

    } catch (error) {
        res.json({ error: "Error" });
    }
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const det_inventarios = await det_inventario.create(req.body, { transaction: t });
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({ error: "Error" });
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: det_inventarios
                })
            }
        })
    } catch (error) {
        //console.log('Error catch', error);
        t.rollback();
        res.json({ error: "Error" });
    }

})

routes.put('/put/:iddet_inventario', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const det_inventarios = await det_inventario.update(req.body, { where: { iddet_inventario: req.params.iddet_inventario } }, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({ error: "Error" });
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: det_inventarios
                })
            }
        })
    } catch (error) {
        res.json({ error: "error catch" });
        t.rollback();
    }
})

routes.put('/inactiva/:iddet_inventario', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        //Captura parametro
        const { cantidad, idinventario, estado } = req.body;
        //Query de actualizacion de cabecera
        const query = `update inventario set cantidad_total=(cantidad_total - ${cantidad})  where idinventario = ${idinventario}`;
        await database.query(query, {
            transaction: t
        });
        //Inactivacion de detalle
        const det_inventarios = await det_inventario.update({ estado }, { where: { iddet_inventario: req.params.iddet_inventario } }, {
            transaction: t
        });

        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({ error: "Error" });
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: det_inventarios
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({ error: "error catch" });
    }
});

routes.delete('/del/:iddet_inventario', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const det_inventarios = await det_inventario.destroy({ where: { iddet_inventario: req.params.iddet_inventario } }, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({ error: "Error" });
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: det_inventarios
                })
            }
        })
    } catch (error) {
        res.json({ error: "error catch" });
        t.rollback();
    }

})

module.exports = routes;