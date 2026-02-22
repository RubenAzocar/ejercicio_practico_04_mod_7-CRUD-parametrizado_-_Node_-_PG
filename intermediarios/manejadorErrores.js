// ===== Manejador de Errores Global =====

module.exports = (error, req, res, next) => {
    console.error('Error no controlado detectado:', error);
    res.status(500).json({
        ok: false,
        mensaje: 'Ocurrió un error interno en el servidor'
    });
};
