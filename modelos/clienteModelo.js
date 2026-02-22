// ===== Modelo de Cliente =====
// Encapsula todas las operaciones de base de datos relacionadas con la tabla "clientes".

const conexion = require('../bd/configuracion');

/**
 * Asegura que la tabla exista e inserta datos iniciales si está vacía.
 */
async function inicializar() {
    try {
        await conexion.query({ text: 'SELECT 1', values: [] });
    } catch (errorConexion) {
        console.error('No se puede conectar a la base de datos durante la inicialización:', errorConexion.message);
        throw errorConexion;
    }

    const consultaCreacion = `
    CREATE TABLE IF NOT EXISTS clientes (
      rut TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      edad INTEGER NOT NULL CHECK (edad >= 0)
    )
  `;
    await conexion.query({ text: consultaCreacion, values: [] });

    const { rowCount } = await conexion.query({ text: 'SELECT 1 FROM clientes LIMIT 1', values: [] });
    if (rowCount === 0) {
        // Semilla de datos iniciales
        const consultaSemilla = `
      INSERT INTO clientes (rut, nombre, edad) VALUES
      ('11.111.111-1', 'Juan Perez', 30),
      ('22.222.222-2', 'Maria Lopez', 25)
    `;
        await conexion.query({ text: consultaSemilla, values: [] });
    }
}

async function obtenerTodos() {
    const q = { text: 'SELECT rut, nombre, edad FROM clientes', values: [] };
    return conexion.query(q);
}

async function buscarPorRut(rut) {
    const q = { text: 'SELECT rut, nombre, edad FROM clientes WHERE rut = $1', values: [rut] };
    return conexion.query(q);
}

async function buscarPorEdad(edad) {
    const q = { text: 'SELECT rut, nombre, edad FROM clientes WHERE edad = $1', values: [edad] };
    return conexion.query(q);
}

async function buscarPorNombre(nombre) {
    const q = { text: 'SELECT rut, nombre, edad FROM clientes WHERE nombre ILIKE $1', values: [nombre + '%'] };
    return conexion.query(q);
}

async function crearCliente(rut, nombre, edad) {
    const q = {
        text: 'INSERT INTO clientes (rut, nombre, edad) VALUES ($1, $2, $3) RETURNING rut, nombre, edad',
        values: [rut, nombre, edad],
    };
    return conexion.query(q);
}

async function actualizarNombre(rut, nombre) {
    const q = {
        text: 'UPDATE clientes SET nombre = $1 WHERE rut = $2',
        values: [nombre, rut],
    };
    return conexion.query(q);
}

async function eliminarPorRut(rut) {
    const q = { text: 'DELETE FROM clientes WHERE rut = $1', values: [rut] };
    return conexion.query(q);
}

module.exports = {
    inicializar,
    obtenerTodos,
    buscarPorRut,
    buscarPorEdad,
    buscarPorNombre,
    crearCliente,
    actualizarNombre,
    eliminarPorRut
};
