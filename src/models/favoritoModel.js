const pool = require('../config/db');

const listarFavoritosPorUsuario = async (usuarioId) => {
  const { rows } = await pool.query(
    `SELECT f.id AS favorito_id, f.agregado_en,
            p.id AS producto_id, p.nombre, p.descripcion, p.categoria, p.precio
     FROM favoritos f
     INNER JOIN productos p ON p.id = f.producto_id
     WHERE f.usuario_id = $1
     ORDER BY f.agregado_en DESC`,
    [usuarioId]
  );
  return rows;
};

const agregarFavorito = async (usuarioId, productoId) => {
  const { rows } = await pool.query(
    `INSERT INTO favoritos (usuario_id, producto_id)
     VALUES ($1, $2)
     RETURNING id, usuario_id, producto_id, agregado_en`,
    [usuarioId, productoId]
  );
  return rows[0];
};

const eliminarFavorito = async (usuarioId, productoId) => {
  const { rowCount } = await pool.query(
    'DELETE FROM favoritos WHERE usuario_id = $1 AND producto_id = $2',
    [usuarioId, productoId]
  );
  return rowCount > 0;
};

module.exports = {
  listarFavoritosPorUsuario,
  agregarFavorito,
  eliminarFavorito
};
