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

rutas.use('/api/ciudad',ciudad);
rutas.use('/api/cliente',cliente);
rutas.use('/api/sucursal',sucursal);
rutas.use('/api/persona',persona)
rutas.use('/api/usuario',usuario)
rutas.use('/api/proveedor',proveedor)
rutas.use('/api/producto',producto)
rutas.use('/api/inventario',inventario)
rutas.use('/api/detinventario',detinventario)
rutas.use('/api/venta',venta)
rutas.use('/api/detventa',detventa)
rutas.use('/api/pregseguridad',preg_seguridad)

module.exports = rutas;