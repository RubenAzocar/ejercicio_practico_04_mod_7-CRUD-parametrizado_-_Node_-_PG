// CONFIGURACIÓN DE CONEXIÓN A LA BASE DE DATOS
// Este módulo exporta una instancia de Pool de pg configurada.

const { Pool } = require('pg');

// Validar variables de entorno al cargar el módulo
if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.warn('Advertencia: No se detectaron DB_USER o DB_PASSWORD en el entorno.');
}

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'parametrizadas_DB',
});

// Verificar la conexión inicial
pool.query('SELECT 1')
    .then(() => console.log('Conexión con PostgreSQL establecida correctamente.'))
    .catch(err => {
        console.error('Error al conectar con PostgreSQL:', err.message);
    });

module.exports = pool;
