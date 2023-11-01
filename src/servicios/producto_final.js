const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const producto_final = require("../model/model_producto_final")
const receta = require("../model/model_receta")
const database = require('../database')
const { QueryTypes } = require("sequelize")
const verificaToken = require('../middleware/token_extractor');
const producto = require('../model/model_producto');
require("dotenv").config()


routes.get('/getsql/', verificaToken, async (req, res) => {
    try {
        const productos_finales = await database.query(`select * from producto_final where estado='AC'`, { type: QueryTypes.SELECT })

        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: 'error', mensjae: error });
            } else {
                res.json({
                    estado: "successfully",
                    body: productos_finales
                })
            }
        })
    } catch (error) {
        res.json({ estado: 'error', mensjae: error });
    }
});

routes.get('/productoventa/', verificaToken, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: 'error', mensjae: error });
            } else {
                const idsucursal = authData?.rsusuario?.idsucursal;
                const productos_finales = await database.query(`select * from vw_venta_prod_stock where estado ='AC' and idsucursal=${idsucursal} order by nombre asc`,
                    {
                        model: producto_final,
                        mapToModel: true // pass true here if you have any mapped fields
                    }
                    , { type: QueryTypes.SELECT });
                res.json({
                    estado: "successfully",
                    body: productos_finales
                })
            }
        })
    } catch (error) {
        res.json({ estado: 'error', mensjae: error });
    }
});

routes.get('/get/', verificaToken, async (req, res) => {

    try {
        const productos_finales = await producto_final.findAll({
            include: [
                {
                    model: receta, include: [
                        { model: producto },
                    ]
                },
            ]
        });

        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: 'error', mensjae: error });;
            } else {
                res.json({
                    estado: "successfully",
                    body: productos_finales
                })
            }
        })
    } catch (error) {
        res.json({ estado: 'error', mensjae: error });
    }
})

routes.get('/get/:idproducto_final', verificaToken, async (req, res) => {
    const productos_finales = await producto_final.findByPk(req.params.idproducto_final)
    jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
        if (error) {
            res.json({ estado: 'error', mensjae: error });;
        } else {

            res.json({
                estado: "successfully",
                body: productos_finales
            });
        }
    })
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    console.log('Entra en prod final -----------------------------------------------')
    try {
        const productos_finales = await producto_final.create(req.body, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: 'error', mensjae: error });
            } else {
                t.commit();
                //console.log('Commitea')
                res.json({
                    estado: "successfully",
                    mensaje: "Registro almacenado",
                    body: productos_finales
                })
            }
        })
    } catch (error) {
        res.json({ estado: 'error', mensjae: error });
        //console.log('Rollback')
        t.rollback();
    }
})

routes.put('/put/:idproducto_final', verificaToken, async (req, res) => {

    const t = await database.transaction();
    try {
        const productos_finales = await producto_final.update(req.body, { where: { idproducto_final: req.params.idproducto_final } }, {
            transaction: t
        });

        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {

            if (error) {
                t.rollback();
                res.send("Error autenticacion: ", error);
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro actualizado",
                    body: productos_finales
                })
            }
        });

    } catch (error) {
        res.json({ estado: 'error', mensjae: error });
    }
})

routes.put('/inactiva/:idproducto_final', verificaToken, async (req, res) => {

    const t = await database.transaction();
    //console.log("Entra en inactiva", req.params.idproducto_final);

    try {
        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: 'error', mensjae: error });
            } else {

                const tcab = await database.transaction();

                await producto_final.update(req.body, { where: { idproducto_final: req.params.idproducto_final } }, {
                    transaction: tcab
                });
                tcab.commit();
                const queryDet = `update producto_final set estado='IN' where idproducto_final = ${req.params.idproducto_final}`;

                await database.query(queryDet, {
                    transaction: t
                });

                t.commit();

                res.json({
                    estado: "successfully",
                    mensaje: "Registro inactivado",
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({ estado: 'error', mensjae: error });;
    }
})

routes.delete('/del/:idproducto_final', verificaToken, async (req, res) => {

    const t = await database.transaction();

    try {
        const productos_finales = await producto_final.destroy({ where: { idproducto_final: req.params.idproducto_final } }, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: 'error', mensjae: error });;
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro eliminado",
                })
            }
        })
    } catch (error) {
        res.json({ estado: 'error', mensjae: error });
        t.rollback();
    }
})


module.exports = routes;