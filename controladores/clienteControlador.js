// ===== Controlador de Clientes =====
const modelo = require('../modelos/clienteModelo');
const { formatearRut } = require('../intermediarios/validacion');

/**
 * Envía una respuesta de error estandarizada
 */
function enviarError(res, codigo, mensaje) {
    return res.status(codigo).json({ ok: false, mensaje });
}

/**
 * Envía una respuesta de éxito estandarizada
 */
function enviarExito(res, datos = {}, estado = 200) {
    return res.status(estado).json(Object.assign({ ok: true }, datos));
}

/**
 * Listar clientes con filtros opcionales
 */
async function listarClientes(req, res) {
    try {
        const { rut, edad, nombre } = req.query;

        if (rut) {
            const rutFormateado = formatearRut(rut);
            const { rows } = await modelo.buscarPorRut(rutFormateado);
            return enviarExito(res, { data: rows });
        }
        if (edad) {
            const edadNum = Number(edad);
            if (isNaN(edadNum)) return enviarError(res, 400, 'La edad debe ser un valor numérico');
            const { rows } = await modelo.buscarPorEdad(edadNum);
            return enviarExito(res, { data: rows });
        }
        if (nombre) {
            const { rows } = await modelo.buscarPorNombre(nombre);
            return enviarExito(res, { data: rows });
        }

        const { rows } = await modelo.obtenerTodos();
        return enviarExito(res, { data: rows });
    } catch (error) {
        console.error(error);
        return enviarError(res, 500, 'Error interno del servidor');
    }
}

/**
 * Eliminar un cliente por RUT, nombre o edad
 */
async function eliminarCliente(req, res) {
    try {
        const { rut, nombre, edad } = req.query;

        if (rut) {
            const rutFormateado = formatearRut(rut);
            const resultado = await modelo.eliminarPorRut(rutFormateado);
            if (resultado.rowCount === 0) return enviarError(res, 404, 'El cliente no existe');
            return enviarExito(res, { rowCount: resultado.rowCount, mensaje: 'Cliente eliminado correctamente' });
        }

        if (nombre) {
            const encontrados = await modelo.buscarPorNombre(nombre);
            if (encontrados.rows.length > 1) return enviarError(res, 400, 'Criterio poco específico: existen múltiples coincidencias');
            if (encontrados.rows.length === 0) return enviarError(res, 404, 'No se encontró ningún cliente con ese nombre');

            const rutObjetivo = encontrados.rows[0].rut;
            const resultado = await modelo.eliminarPorRut(rutObjetivo);
            return enviarExito(res, { rowCount: resultado.rowCount, mensaje: `Eliminado correctamente: ${encontrados.rows[0].nombre}` });
        }

        if (edad) {
            const edadNum = Number(edad);
            if (isNaN(edadNum)) return enviarError(res, 400, 'La edad debe ser numérica');
            const encontrados = await modelo.buscarPorEdad(edadNum);
            if (encontrados.rows.length > 1) return enviarError(res, 400, 'Criterio poco específico: múltiples personas con la misma edad');
            if (encontrados.rows.length === 0) return enviarError(res, 404, 'No se encontró ningún cliente con esa edad');

            const rutObjetivo = encontrados.rows[0].rut;
            const resultado = await modelo.eliminarPorRut(rutObjetivo);
            return enviarExito(res, { rowCount: resultado.rowCount, mensaje: `Eliminado correctamente cliente de ${edadNum} años` });
        }

        return enviarError(res, 400, 'Se requiere un parámetro (rut, nombre o edad) para eliminar');
    } catch (error) {
        console.error(error);
        return enviarError(res, 500, 'Error interno del servidor');
    }
}

/**
 * Actualizar el nombre de un cliente
 */
async function actualizarCliente(req, res) {
    try {
        const { rut } = req.params;
        const { nombre } = req.body;
        if (!nombre) return enviarError(res, 400, 'El nuevo nombre es obligatorio');

        const rutFormateado = formatearRut(rut);
        const resultado = await modelo.actualizarNombre(rutFormateado, nombre);
        if (resultado.rowCount === 0) return enviarError(res, 404, 'El cliente no existe');
        return enviarExito(res, { rowCount: resultado.rowCount, mensaje: 'Nombre actualizado correctamente' });
    } catch (error) {
        console.error(error);
        return enviarError(res, 500, 'Error interno del servidor');
    }
}

/**
 * Crear un nuevo cliente
 */
async function crearCliente(req, res) {
    try {
        let { rut, nombre, edad } = req.body;
        // La validación detallada se hace en el intermediario de rutas

        // Estandarizar RUT antes de guardar
        rut = formatearRut(rut);

        // Comprobar si ya existe
        const existente = await modelo.buscarPorRut(rut);
        if (existente.rowCount > 0) return enviarError(res, 409, 'El RUT ya se encuentra registrado');

        const { rows } = await modelo.crearCliente(rut, nombre, Number(edad));
        return enviarExito(res, { data: rows[0] }, 201);
    } catch (error) {
        console.error(error);
        return enviarError(res, 500, 'Error interno del servidor');
    }
}

module.exports = {
    listarClientes,
    eliminarCliente,
    actualizarCliente,
    crearCliente
};
