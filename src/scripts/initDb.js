const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
require('dotenv').config();

const inicializar = async () => {
  try {
    const schemaPath = path.join(__dirname, '../../sql/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log("[DB] Tablas 'usuarios', 'productos', 'favoritos' verificadas en PostgreSQL.");

    const adminCorreo = (process.env.ADMIN_CORREO || 'admin@catalogo.ec').toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin2026*Secure';
    const adminNombre = process.env.ADMIN_NOMBRE || 'Administrador Principal';

    const hashAdmin = await bcrypt.hash(adminPass, 10);
    await pool.query(
      `INSERT INTO usuarios (nombre, correo, password_hash, rol)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (correo) DO NOTHING`,
      [adminNombre, adminCorreo, hashAdmin]
    );

    const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM productos');
    if (rows[0].total === 0) {
      const productosIniciales = [
        ['Laptop Lenovo ThinkPad E14', 'Procesador Ryzen 7, 16GB RAM, 512GB SSD NVMe', 'Computación', 899.99],
        ['Mouse Inalámbrico Logitech MX Master 3S', 'Sensor 8000 DPI, recargable USB-C', 'Accesorios', 99.50],
        ['Teclado Mecánico Keychron K2', 'Switches táctiles, retroiluminación LED, Bluetooth', 'Accesorios', 89.00],
        ['Monitor Dell UltraSharp 24 pulgadas', 'Resolución Full HD IPS, ajuste de altura', 'Monitores', 249.00],
        ['Disco SSD Externo Samsung T7 1TB', 'Velocidad hasta 1050 MB/s USB 3.2 Gen 2', 'Almacenamiento', 115.00]
      ];
      for (const [nombre, descripcion, categoria, precio] of productosIniciales) {
        await pool.query(
          'INSERT INTO productos (nombre, descripcion, categoria, precio) VALUES ($1, $2, $3, $4)',
          [nombre, descripcion, categoria, precio]
        );
      }
    }
    console.log(`[SEED] Admin creado: ${adminCorreo} | 5 productos iniciales cargados.`);
  } catch (err) {
    console.error('[ERROR INIT DB]', err.message);
  } finally {
    await pool.end();
  }
};

inicializar();
