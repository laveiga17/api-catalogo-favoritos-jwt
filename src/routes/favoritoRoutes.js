const express = require('express');
const router = express.Router();
const {
  listarFavoritos,
  agregarFavorito,
  eliminarFavorito
} = require('../controllers/favoritoController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.use(verificarToken);
router.get('/', listarFavoritos);
router.post('/', agregarFavorito);
router.delete('/:productoId', eliminarFavorito);

module.exports = router;
