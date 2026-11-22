const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuarioModel');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registro = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password || !nombre.trim() || !EMAIL_REGEX.test(correo.trim()) || password.length < 6) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalle: 'Debe proporcionar nombre, correo válido y contraseña de al menos 6 caracteres'
      });
    }

    const correoNorm = correo.trim().toLowerCase();
    const existente = await UsuarioModel.buscarPorCorreo(correoNorm);
    if (existente) {
      return res.status(409).json({ error: 'El correo ya se encuentra registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // El registro público siempre fuerza el rol 'usuario'
    const nuevoUsuario = await UsuarioModel.crearUsuario({
      nombre: nombre.trim(),
      correo: correoNorm,
      passwordHash,
      rol: 'usuario'
    });

    return res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: nuevoUsuario
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno al registrar usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ error: 'Debe ingresar correo y contraseña' });
    }

    const usuario = await UsuarioModel.buscarPorCorreo(correo.trim().toLowerCase());
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '2h';
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    return res.status(200).json({
      mensaje: 'Autenticación exitosa',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      },
      token,
      expiraEn: expiresIn
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno al iniciar sesión' });
  }
};

module.exports = { registro, login };
