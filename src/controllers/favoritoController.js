const FavoritoModel = require('../models/favoritoModel');
const ProductoModel = require('../models/productoModel');

const listarFavoritos = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const favoritos = await FavoritoModel.listarFavoritosPorUsuario(usuarioId);
    return res.status(200).json({
      usuarioId,
      total: favoritos.length,
      favoritos
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error al listar favoritos' });
  }
};

const agregarFavorito = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const productoId = Number(req.body.productoId);
    if (!Number.isInteger(productoId) || productoId <= 0) {
      return res.status(400).json({ error: 'Debe proporcionar un productoId numérico válido' });
    }

    const producto = await ProductoModel.obtenerProductoPorId(productoId);
    if (!producto) {
      return res.status(404).json({ error: 'El producto especificado no existe' });
    }

    const favorito = await FavoritoModel.agregarFavorito(usuarioId, productoId);
    return res.status(201).json({
      mensaje: 'Producto agregado a favoritos',
      favorito
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'El producto ya se encuentra en sus favoritos',
        codigo: 'DUPLICATE_FAVORITE'
      });
    }
    return res.status(500).json({ error: 'Error al agregar favorito' });
  }
};

const eliminarFavorito = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const productoId = Number(req.params.productoId);
    if (!Number.isInteger(productoId) || productoId <= 0) {
      return res.status(400).json({ error: 'Identificador de producto inválido' });
    }

    const eliminado = await FavoritoModel.eliminarFavorito(usuarioId, productoId);
    if (!eliminado) {
      return res.status(404).json({ error: 'El producto no se encuentra en sus favoritos' });
    }

    return res.status(200).json({ mensaje: 'Producto eliminado de sus favoritos' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al eliminar favorito' });
  }
};

module.exports = { listarFavoritos, agregarFavorito, eliminarFavorito };
