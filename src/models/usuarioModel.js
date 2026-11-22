const pool = require('../config/db');

const buscarPorCorreo = async (correo) => {
  const { rows } = await pool.query(
    'SELECT id, nombre, correo, password_hash, rol, creado_en FROM usuarios WHERE correo = $1',
    [correo]
  );
  return rows[0];
};

const crearUsuario = async ({ nombre, correo, passwordHash, rol = 'usuario' }) => {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, correo, password_hash, rol)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, correo, rol, creado_en`,
    [nombre, correo, passwordHash, rol]
  );
  return rows[0];
};

module.exports = { buscarPorCorreo, crearUsuario };
