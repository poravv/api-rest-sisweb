const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const venta = require("../model/model_venta")
const usuario = require("../model/model_usuario")
const cliente = require("../model/model_cliente")
const detventa = require("../model/model_detventa")
const producto_final = require("../model/model_producto_final")
const database = require('../database');
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()
//let fechaActual = new Date();

routes.get('/get/', verificaToken, async (req, res) => {
    const ventas = await venta.findAll({
        include: [
            { model: usuario },
            { model: cliente },
            { model: detventa, include: [{ model: producto_final }] },
        ]
    })

    jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
        if (error) {
            res.json({ estado: "error", mensaje: error })
        } else {
            res.json({
                estado: "successfully",
                body: ventas
            })
        }
    })
});

routes.get('/getvenusu', verificaToken, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error })
            } else {
                const idusuario = authData?.rsusuario?.idusuario;
                const ventas = await venta.findAll({
                    where: { idusuario: idusuario, estado: 'AC' },
                    include: [
                        { model: usuario },
                        { model: cliente },
                        { model: detventa, include: [{ model: producto_final }] },
                    ]
                })
                res.json({
                    estado: "successfully",
                    body: ventas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
    }
});

/*venta o retorno*/
routes.post('/operacionventa/:idproducto_final/:operacion/:total', verificaToken, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({
                    error: "error"
                });
            } else {
                const idusuario = authData?.rsusuario?.idusuario;
                await database.query('CALL addventainventario(' + req.params.idproducto_final + ',"' + req.params.operacion + '",' + idusuario + ',' + req.params.total + ',@a)');
                res.json({
                    estado: "successfully",
                    mensaje: "Operacion procesada"
                });
            }
        });
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
    }
});


routes.post('/verificaproceso/:idusuario-:tabla', verificaToken, async (req, res) => {

    try {
        await database.query(`CALL verificaProcesos(${req.params.idusuario},'${req.params.tabla}',@a)`);

        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ error: "Error" });;
            } else {
                res.json({
                    estado: "successfully",
                    mensaje: "Venta procesada con exito"
                });
            }
        });
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
    }
});



routes.get('/get/:idventa', verificaToken, async (req, res) => {
    const ventas = await venta.findByPk(req.params.idventa, {
        include: [
            { model: usuario },
            { model: cliente },
            { model: detventa, include: [{ model: producto_final }] },
        ]
    })
    jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
        if (error) {
            res.json({ estado: "error", mensaje: error })
        } else {
            res.json({
                estado: "successfully",
                body: ventas
            })
        }
    })
})

routes.get('/getDet/', verificaToken, async (req, res) => {
    const ventas = await venta.findAll({
        include: [
            { model: usuario },
            { model: cliente },
            { model: detventa, include: [{ model: producto_final }] },
        ]
    })

    jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
        if (error) {
            res.json({ estado: "error", mensaje: error })
        } else {
            res.json({
                estado: "successfully",
                body: ventas
            })
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {

    //console.log(req.body);

    const t = await database.transaction();
    try {
        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error })
            } else {
                //const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
                //req.body.fecha = strFecha;
                req.body.idusuario = authData?.rsusuario?.idusuario;
                const ventas = await venta.create(req.body, { transaction: t })
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro almacenado",
                    body: ventas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        t.rollback();
    }

})

routes.put('/put/:idventa', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const ventas = await venta.update(req.body, { where: { idventa: req.params.idventa }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error })
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro actualizado",
                    body: ventas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        t.rollback();
    }
})

routes.put('/inactiva/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        //Captura parametro 
        const { idventa, idusuario } = req.body;
        //Query de actualizacion de cabecera
        const query = `CALL inactivapedidoventa(${idventa},${idusuario},@a)`;
        console.log(query);

        await database.query(query, {
            transaction: t
        });

        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error })
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro actualizado",
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        t.rollback();
    }

})

routes.delete('/del/:idventa', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const ventas = await venta.destroy({ where: { idventa: req.params.idventa }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error })
            } else {
                t.transaction()
                res.json({
                    estado: "successfully",
                    mensaje: "Registro eliminado",
                    body: ventas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error })
        t.rollback();
    }

})

module.exports = routes;