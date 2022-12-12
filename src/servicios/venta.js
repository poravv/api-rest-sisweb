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

routes.get('/get/', verificaToken, async (req, res) => {
    const ventas = await venta.findAll({
        include: [
            { model: usuario },
            { model: cliente },
            { model: detventa , include:[{ model:producto_final }]},
        ]
    })

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error ",err});
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: ventas
            })
        }
    })
});

routes.get('/getvenusu/:idusuario', verificaToken, async (req, res) => {
    try {
        const ventas = await venta.findAll({where: { idusuario: req.params.idusuario },
            include: [
                { model: usuario },
                { model: cliente },
                { model: detventa , include:[{ model:producto_final }]},
            ]
        })
    
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error ",err});
            } else {
                res.json({
                    mensaje: "successfully",
                    authData: authData,
                    body: ventas
                })
            }
        })
    } catch (error) {
        res.json({
            error: "error"
        })
    }
});

/*venta o retorno*/
routes.post('/operacionventa/:idproducto_final-:operacion-:idusuario-:total', verificaToken, async (req, res) => {

    try {
        await database.query('CALL addventainventario('+req.params.idproducto_final+',"'+req.params.operacion+'",'+req.params.idusuario+','+req.params.total+',@a)');

        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({
                    error: "error"
                });
            } else {
                res.json({
                    mensaje: "successfully",
                    authData: authData,
                });
            }
        });
    } catch (error) {
        res.json({
            error: "error en operaciones"
        });
    }
});


routes.post('/verificaproceso/:idusuario-:tabla', verificaToken, async (req, res) => {

    try {
        await database.query(`CALL verificaProcesos(${req.params.idusuario},'${req.params.tabla}',@a)`);

        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error"});;
            } else {
                res.json({
                    mensaje: "successfully",
                    authData: authData,
                });
            }
        });
    } catch (error) {
        res.json({error: "error catch"});
    }
});



routes.get('/get/:idventa', verificaToken, async (req, res) => {
    const ventas = await venta.findByPk(req.params.idventa, {
        include: [
            { model: usuario },
            { model: cliente },
            { model: detventa , include:[{ model:producto_final }]},
        ]
    })
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error ",err});
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
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
            { model:detventa , include:[{ model:producto_final }]},
        ]
    })

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            res.json({error: "Error ",err});
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: ventas
            })
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    
    console.log(req.body);

    const t = await database.transaction();
    try {
        const ventas = await venta.create(req.body, { transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error ",err});
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: ventas
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        t.rollback();
    }

})

routes.put('/put/:idventa', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const ventas = await venta.update(req.body, { where: { idventa: req.params.idventa }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error ",err});
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro actualizado",
                    authData: authData,
                    body: ventas
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        t.rollback();
    }

})

routes.delete('/del/:idventa', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const ventas = await venta.destroy({ where: { idventa: req.params.idventa }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                res.json({error: "Error ",err});
            } else {
                t.transaction()
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: ventas
                })
            }
        })
    } catch (error) {
        res.json({error: "error catch"});
        t.rollback();
    }

})

module.exports = routes;