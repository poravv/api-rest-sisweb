const express = require('express');
const rutas = express()

const ciudad = require('./routes/ciudad')
const cliente = require('./routes/cliente')
const sucursal = require('./routes/sucursal')
const persona = require('./routes/persona')
const usuario = require('./routes/usuario');
const proveedor = require('./routes/proveedor');
const producto = require('./routes/producto');
const inventario = require('./routes/inventario');
const detinventario = require('./routes/detinventario');
const venta = require('./routes/venta');
const detventa = require('./routes/detventa');
const preg_seguridad = require('./routes/preg_seguridad');

rutas.use('/sisweb/api/ciudad',ciudad);
rutas.use('/sisweb/api/cliente',cliente);
rutas.use('/sisweb/api/sucursal',sucursal);
rutas.use('/sisweb/api/persona',persona)
rutas.use('/sisweb/api/usuario',usuario)
rutas.use('/sisweb/api/proveedor',proveedor)
rutas.use('/sisweb/api/producto',producto)
rutas.use('/sisweb/api/inventario',inventario)
rutas.use('/sisweb/api/detinventario',detinventario)
rutas.use('/sisweb/api/venta',venta)
rutas.use('/sisweb/api/detventa',detventa)
rutas.use('/sisweb/api/pregseguridad',preg_seguridad)

module.exports = rutas;