const pool = require('../config/db');

const listarProductos = async (categoria) => {
  if (categoria) {
    const { rows } = await pool.query(
      'SELECT id, nombre, descripcion, categoria, precio, creado_en FROM productos WHERE LOWER(categoria) = LOWER($1) ORDER BY id ASC',
      [categoria.trim()]
    );
    return rows;
  }
  const { rows } = await pool.query(
    'SELECT id, nombre, descripcion, categoria, precio, creado_en FROM productos ORDER BY id ASC'
  );
  return rows;
};

const obtenerProductoPorId = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, nombre, descripcion, categoria, precio, creado_en FROM productos WHERE id = $1',
    [id]
  );
  return rows[0];
};

const crearProducto = async ({ nombre, descripcion, categoria, precio }) => {
  const { rows } = await pool.query(
    `INSERT INTO productos (nombre, descripcion, categoria, precio)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, descripcion, categoria, precio, creado_en`,
    [nombre, descripcion, categoria, precio]
  );
  return rows[0];
};

const actualizarProducto = async (id, { nombre, descripcion, categoria, precio }) => {
  const { rows } = await pool.query(
    `UPDATE productos
     SET nombre = $1, descripcion = $2, categoria = $3, precio = $4
     WHERE id = $5
     RETURNING id, nombre, descripcion, categoria, precio, creado_en`,
    [nombre, descripcion, categoria, precio, id]
  );
  return rows[0];
};

const eliminarProducto = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = {
  listarProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
