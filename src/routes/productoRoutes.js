const express = require('express');
const router = express.Router();
const {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productoController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { requerirAdmin } = require('../middlewares/roleMiddleware');

router.get('/', obtenerProductos);
router.get('/:id', obtenerProducto);
router.post('/', verificarToken, requerirAdmin, crearProducto);
router.put('/:id', verificarToken, requerirAdmin, actualizarProducto);
router.delete('/:id', verificarToken, requerirAdmin, eliminarProducto);

module.exports = router;
