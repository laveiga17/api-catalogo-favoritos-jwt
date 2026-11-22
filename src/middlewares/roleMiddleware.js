const requerirAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({
      error: 'Acceso denegado',
      detalle: 'Se requiere rol de administrador para esta operación'
    });
  }
  next();
};

module.exports = { requerirAdmin };
