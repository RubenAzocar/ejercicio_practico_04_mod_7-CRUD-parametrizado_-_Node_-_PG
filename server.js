// ===== Punto de Entrada del Servidor =====
const express = require('express');
const seguridad = require('./intermediarios/seguridad');
const manejadorErrores = require('./intermediarios/manejadorErrores');
const rutasCliente = require('./rutas/clienteRutas');
const modeloCliente = require('./modelos/clienteModelo');

const aplicacion = express();
const puerto = process.env.PORT || 3000;

// Aplicar middleware de seguridad
seguridad(aplicacion);

// Middleware para parsear cuerpos JSON
aplicacion.use(express.json());

// Servir archivos estáticos del frontend
aplicacion.use(express.static('publico'));

// Montar rutas de la API
aplicacion.use('/', rutasCliente);

// Manejador de errores global
aplicacion.use(manejadorErrores);

// Inicializar la base de datos y arrancar el servidor
modeloCliente.inicializar()
    .then(() => {
        aplicacion.listen(puerto, () => {
            console.log(`Servidor iniciado exitosamente en http://localhost:${puerto}`);
        });
    })
    .catch(error => {
        console.error('Error crítico al inicializar la base de datos:', error);
        process.exit(1);
    });
