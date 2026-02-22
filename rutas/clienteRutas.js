// ===== Rutas de Cliente =====
const express = require('express');
const enrutador = express.Router();
const controlador = require('../controladores/clienteControlador');
const { body, query } = require('express-validator');
const { validarPeticion, validarRut } = require('../intermediarios/validacion');

// GET /clientes
enrutador.get(
    '/clientes',
    [
        query('edad').optional().isInt({ min: 0 }).withMessage('La edad debe ser un número entero positivo'),
        query('rut').optional().custom(valor => {
            if (!validarRut(valor)) throw new Error('RUT no válido');
            return true;
        }),
        query('nombre').optional().isString()
    ],
    validarPeticion,
    controlador.listarClientes
);

// DELETE /clientes
enrutador.delete(
    '/clientes',
    [
        query('edad').optional().isInt().withMessage('La edad debe ser numérica'),
        query('rut').optional().custom(valor => {
            if (!validarRut(valor)) throw new Error('RUT no válido');
            return true;
        }),
        query('nombre').optional().isString()
    ],
    validarPeticion,
    controlador.eliminarCliente
);

// PUT /clientes/:rut
enrutador.put(
    '/clientes/:rut',
    [
        body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio')
    ],
    validarPeticion,
    controlador.actualizarCliente
);

// POST /clientes
enrutador.post(
    '/clientes',
    [
        body('rut').notEmpty().withMessage('RUT es obligatorio').custom(valor => {
            if (!validarRut(valor)) throw new Error('RUT no válido');
            return true;
        }),
        body('nombre').isString().notEmpty().withMessage('Nombre es obligatorio'),
        body('edad').isInt({ min: 0 }).withMessage('La edad debe ser un número entero positivo')
    ],
    validarPeticion,
    controlador.crearCliente
);

module.exports = enrutador;
