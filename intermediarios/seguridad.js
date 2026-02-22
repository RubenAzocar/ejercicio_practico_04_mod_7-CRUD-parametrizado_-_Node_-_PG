// ===== Middleware de Seguridad =====
const helmet = require('helmet');

module.exports = function (aplicacion) {
    // Establece encabezados HTTP para seguridad
    // Se deshabilita CSP para permitir scripts inline si fuera necesario (aunque ya se movieron a externos)
    aplicacion.use(helmet({
        contentSecurityPolicy: false
    }));
};
