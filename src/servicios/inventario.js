const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const inventario = require("../model/model_inventario")
const sucursal = require("../model/model_sucursal")
const producto = require("../model/model_producto")
const detinventario = require("../model/model_detinventario")
const database = require('../database')
const verificaToken = require('../middleware/token_extractor');
const { QueryTypes } = require('sequelize');
require("dotenv").config()





routes.get('/getsql/', verificaToken, async (req, res) => {
    try {

        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {

            if (error) {
                res.json({ estado: "error", mensaje: error, })
            } else {
                const idsucursal = authData?.rsusuario?.idsucursal;
                const inv_analisis = await database.query(`select * from vw_analisis_inv where idsucursal=${idsucursal}`, { type: QueryTypes.SELECT })
                res.json({
                    estado: "successfully",
                    body: inv_analisis
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.get('/get/', verificaToken, async (req, res) => {
    const inventarios = await inventario.findAll({
        include: [
            { model: sucursal },
            { model: producto },
            { model: detinventario },
        ]
    })

    jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
        if (error) {
            res.json({ estado: "error", mensaje: error });
        } else {
            res.json({
                estado: "successfully",
                body: inventarios
            })
        }
    })
});


routes.get('/getinvsuc/', verificaToken, async (req, res) => {
    try {

        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                //Captura el id de la sucursal
                const idsucursal = authData?.rsusuario?.idsucursal;

                await database.query('CALL cargaInventarioCab(@a)');
                const inventarios = await inventario.findAll({
                    where: { idsucursal: idsucursal },
                    include: [
                        { model: sucursal },
                        { model: producto },
                        { model: detinventario },
                    ]
                })
                res.json({
                    estado: "successfully",
                    body: inventarios
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error });
    }
});

routes.get('/get/:idinventario', verificaToken, async (req, res) => {
    const inventarios = await inventario.findByPk(req.params.idinventario, {
        include: [
            { model: sucursal },
            { model: producto },
            { model: detinventario },
        ]
    })
    jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
        if (error) {
            res.json({ estado: "error", mensaje: error });
        } else {
            res.json({
                estado: "successfully",
                body: inventarios
            })
        }
    })
});

routes.get('/getidproducto/:idproducto', verificaToken, async (req, res) => {

    try {
        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                const idsucursal = authData?.rsusuario?.idsucursal;
                const query = `select * from inventario where idproducto = ${req.params.idproducto} and idsucursal= ${idsucursal} and estado ='AC'`;
                //console.log(query);
                const inventarios = await database.query(query,
                    {
                        model: inventario,
                        mapToModel: true // pass true here if you have any mapped fields
                    });
                res.json({
                    estado: "successfully",
                    body: inventarios
                })
            }
        });
    } catch (error) {
        res.json({ estado: "error", mensaje: error });
    }
});

routes.get('/getDet/', verificaToken, async (req, res) => {
    const inventarios = await inventario.findAll({
        include: [
            { model: sucursal },
            { model: producto },
            { model: detinventario },
        ]
    })

    jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
        if (error) {
            res.json({ estado: "error", mensaje: error });
        } else {
            res.json({
                estado: "successfully",
                body: inventarios
            })
        }
    })
});

routes.post('/post/', verificaToken, async (req, res) => {

    //console.log(req.body)
    const t = await database.transaction();
    try {
        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                req.body.idsucursal = authData?.rsusuario?.idsucursal;
                const inventarios = await inventario.create(req.body, { transaction: t })
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    body: inventarios
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({ estado: "error", mensaje: error });
    }

})


routes.put('/put/:idinventario', verificaToken, async (req, res) => {
    //console.log(req.body)
    const t = await database.transaction();

    try {
        const inventarios = await inventario.update(req.body, { where: { idinventario: req.params.idinventario }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    body: inventarios
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({ estado: "error", mensaje: error });
    }

});

routes.put('/inactiva/:idinventario', verificaToken, async (req, res) => {
    const t = await database.transaction();
    console.log("Entra en inactiva", req.params.idinventario)
    try {
        //Query de actualizacion de cabecera
        const queryCab = `update inventario set cantidad_total = 0 where idinventario = ${req.params.idinventario}`;
        await database.query(queryCab, {
            transaction: t
        });
        //Inactivacion de detalle
        const queryDet = `update det_inventario set estado='IN' where idinventario = ${req.params.idinventario}`;
        await database.query(queryDet, {
            transaction: t
        });

        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({ estado: "error", mensaje: error });
    }
})

routes.delete('/del/:idinventario', verificaToken, async (req, res) => {
    const t = await database.transaction();

    try {
        const inventarios = await inventario.destroy({ where: { idinventario: req.params.idinventario }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });
            } else {
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: inventarios
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error });
        t.rollback();
    }

})

module.exports = routes;