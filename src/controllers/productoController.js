const ProductoModel = require('../models/productoModel');

const validarId = (valor) => {
  const num = Number(valor);
  return Number.isInteger(num) && num > 0 ? num : null;
};

const validarPayloadProducto = ({ nombre, descripcion, categoria, precio }) => {
  if (!nombre || !descripcion || !categoria || !String(nombre).trim() || !String(descripcion).trim() || !String(categoria).trim()) {
    return 'Los campos nombre, descripcion y categoria son obligatorios';
  }
  const precioNum = Number(precio);
  if (Number.isNaN(precioNum) || precioNum <= 0) {
    return 'El precio debe ser un número mayor que cero';
  }
  return null;
};

const obtenerProductos = async (req, res) => {
  try {
    const { categoria } = req.query;
    const productos = await ProductoModel.listarProductos(categoria);
    return res.status(200).json({ total: productos.length, productos });
  } catch (err) {
    return res.status(500).json({ error: 'Error al consultar productos' });
  }
};

const obtenerProducto = async (req, res) => {
  try {
    const id = validarId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Identificador de producto inválido' });

    const producto = await ProductoModel.obtenerProductoPorId(id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    return res.status(200).json({ producto });
  } catch (err) {
    return res.status(500).json({ error: 'Error al consultar el producto' });
  }
};

const crearProducto = async (req, res) => {
  try {
    const errorVal = validarPayloadProducto(req.body);
    if (errorVal) return res.status(400).json({ error: errorVal });

    const producto = await ProductoModel.crearProducto({
      nombre: req.body.nombre.trim(),
      descripcion: req.body.descripcion.trim(),
      categoria: req.body.categoria.trim(),
      precio: Number(req.body.precio)
    });
    return res.status(201).json({ mensaje: 'Producto creado correctamente', producto });
  } catch (err) {
    return res.status(500).json({ error: 'Error al crear el producto' });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const id = validarId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Identificador de producto inválido' });

    const errorVal = validarPayloadProducto(req.body);
    if (errorVal) return res.status(400).json({ error: errorVal });

    const actualizado = await ProductoModel.actualizarProducto(id, {
      nombre: req.body.nombre.trim(),
      descripcion: req.body.descripcion.trim(),
      categoria: req.body.categoria.trim(),
      precio: Number(req.body.precio)
    });
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });

    return res.status(200).json({ mensaje: 'Producto actualizado correctamente', producto: actualizado });
  } catch (err) {
    return res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const id = validarId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Identificador de producto inválido' });

    const eliminado = await ProductoModel.eliminarProducto(id);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });

    return res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
