const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const inventario = require("../model/model_inventario")
const sucursal = require("../model/model_sucursal")
const producto = require("../model/model_producto")
const detinventario = require("../model/model_detinventario")
const database = require('../database')
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()

routes.get('/get/', verificaToken, async (req, res) => {
    const inventarios = await inventario.findAll({
        include: [
            { model: sucursal },
            { model: producto }
        ]
    })

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: inventarios
            })
        }
    })
})

routes.get('/get/:idinventario', verificaToken, async (req, res) => {
    const inventarios = await inventario.findByPk(req.params.idinventario, {
        include: [
            { model: sucursal },
            { model: producto }
        ]
    })
    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: inventarios
            })
        }
    })
});

routes.get('/getidproducto/:idproducto', verificaToken, async (req, res) => {

    const query = `select * from inventario where idproducto = '${req.params.idproducto}' and estado ='AC'`;

    console.log(query);

    const inventarios = await database.query(query,
        {
            model: inventario,
            mapToModel: true // pass true here if you have any mapped fields
        });

    /*
    const inventarios = await inventario.findByPk(req.params.idinventario, {
        include: [
            { model: sucursal },
            { model: producto }
        ]
    });
    */

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: inventarios
            })
        }
    })
});

routes.get('/getDet/', verificaToken, async (req, res) => {
    const inventarios = await inventario.findAll({
        include: [
            { model: sucursal },
            { model: producto },
            { model: detinventario },
        ]
    })

    jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
        if (err) {
            return res.send("Error: ", err)
        } else {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: inventarios
            })
        }
    })
});

routes.post('/post/', verificaToken, async (req, res) => {

    console.log(req.body)

    const t = await database.transaction();

    try {
        const inventarios = await inventario.create(req.body, { transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: inventarios
                })
            }
        })
    } catch (error) {
        t.rollback();
        return res.send("Error: ", err)
    }

})


routes.put('/put/:idinventario', verificaToken, async (req, res) => {
 
    console.log(req.body)

    const t = await database.transaction();

    try {
        const inventarios = await inventario.update(req.body, { where: { idinventario: req.params.idinventario }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Registro almacenado",
                    authData: authData,
                    body: inventarios
                })
            }
        })
    } catch (error) {
        t.rollback();
        return res.send("Error: ", err)
    }

});

routes.put('/inactiva/:idinventario', verificaToken, async (req, res) => {
    const t = await database.transaction();
    console.log("Entra en inactiva",req.params.idinventario)
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

        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                t.commit();
                res.json({
                    mensaje: "Success",
                    authData: authData
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.send("Error: ", error)
    }
})

routes.delete('/del/:idinventario', verificaToken, async (req, res) => {
    const t = await database.transaction();

    try {
        const inventarios = await inventario.destroy({ where: { idinventario: req.params.idinventario }, transaction: t })
        jwt.verify(req.token, process.env.CLAVESECRETA, (err, authData) => {
            if (err) {
                return res.send("Error: ", err)
            } else {
                res.json({
                    mensaje: "Registro eliminado",
                    authData: authData,
                    body: inventarios
                })
            }
        })
    } catch (error) {
        res.send("Error: ", error)
        t.rollback();
    }

})

module.exports = routes;