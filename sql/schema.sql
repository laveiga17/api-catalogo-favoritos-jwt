CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'usuario' CHECK (rol IN ('usuario', 'admin')),
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  precio NUMERIC(10,2) NOT NULL CHECK (precio > 0),
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favoritos (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  agregado_en TIMESTAMP DEFAULT NOW(),
  UNIQUE (usuario_id, producto_id)
);
