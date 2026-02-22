// ===== Intermediario de Validación =====
// Lugar centralizado para verificar resultados de express-validator y responder con 400 si hay algún problema.

const { validationResult } = require('express-validator');

/**
 * Middleware para procesar errores de express-validator
 */
const validarPeticion = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const mensaje = errores.array().map(e => e.msg).join(', ');
        return res.status(400).json({ ok: false, mensaje });
    }
    next();
};

/**
 * Valida solo el formato de un RUT (admite con o sin puntos/guión)
 * @param {string} rut - El rut a validar
 */
function validarRut(rut) {
    if (!rut || typeof rut !== 'string') return false;

    // Limpiar para verificar contenido básico
    let valor = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();

    // Debe tener entre 7 y 9 dígitos de cuerpo + 1 dígito verificador
    // El patrón acepta de 8 a 10 caracteres alfanuméricos básicos
    return /^[0-9]{7,9}[0-9K]$/.test(valor);
}

/**
 * Formatea un RUT al estándar chileno: xx.xxx.xxx-x
 * @param {string} rut - El rut a formatear
 */
function formatearRut(rut) {
    let limpia = rut.toString().replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpia.length < 2) return null;

    const dv = limpia.slice(-1);
    let cuerpo = limpia.slice(0, -1);

    let rev = cuerpo.split('').reverse();
    let formateado = '';
    for (let i = 0; i < rev.length; i++) {
        if (i !== 0 && i % 3 === 0) formateado = '.' + formateado;
        formateado = rev[i] + formateado;
    }
    return formateado + '-' + dv;
}

module.exports = {
    validarPeticion,
    validarRut,
    formatearRut
};
