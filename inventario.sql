-- ============================================================
-- CARIMPORT SYSTEM - BASE DE DATOS COMPLETA
-- Empresa: CAR IMPORT RAMOS & HUAMAN S.A.C.
-- ============================================================

CREATE DATABASE IF NOT EXISTS inventario;
USE inventario;

-- ============================================================
-- 1. IMPORTADORAS
-- ============================================================
CREATE TABLE IF NOT EXISTS importadoras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruc VARCHAR(11) NOT NULL UNIQUE,
    razon_social VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 2. PROVEEDORES
-- ============================================================
CREATE TABLE IF NOT EXISTS proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruc VARCHAR(11) UNIQUE,
    nombre_empresa VARCHAR(100) NOT NULL,
    contacto_nombre VARCHAR(100),
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 3. PRODUCTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_sku VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    precio_compra DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    precio_venta DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    stock_minimo INT DEFAULT 3,
    unidad_medida VARCHAR(20) DEFAULT 'unidad',
    importadora_id INT NULL,
    proveedor_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (importadora_id) REFERENCES importadoras(id) ON DELETE SET NULL,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 4. CLIENTES
-- ============================================================
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    documento VARCHAR(20) UNIQUE,
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_documento (documento),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 5. USUARIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    rol ENUM('ADMIN', 'VENDEDOR', 'ALMACEN') DEFAULT 'VENDEDOR',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 6. COTIZACIONES
-- ============================================================
CREATE TABLE IF NOT EXISTS cotizaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serie VARCHAR(4) DEFAULT 'COT',
    correlativo INT NOT NULL,
    numero VARCHAR(20) NOT NULL UNIQUE,
    cliente_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE,
    condicion_pago ENUM('CONTADO','CREDITO_15','CREDITO_30','CREDITO_45') DEFAULT 'CONTADO',
    moneda ENUM('SOLES','USD') DEFAULT 'SOLES',
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    descuento DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    igv DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estado ENUM('BORRADOR','ENVIADA','APROBADA','RECHAZADA','VENCIDA') DEFAULT 'BORRADOR',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_emision),
    INDEX idx_numero (numero)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 7. DETALLE COTIZACIONES
-- ============================================================
CREATE TABLE IF NOT EXISTS detalle_cotizaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cotizacion_id INT NOT NULL,
    producto_id INT NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(150) NOT NULL,
    cantidad INT NOT NULL,
    unidad ENUM('unidad','par','doc','pack','caja') DEFAULT 'unidad',
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    importe DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 8. PEDIDOS
-- ============================================================
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serie VARCHAR(4) DEFAULT 'PED',
    correlativo INT NOT NULL,
    numero VARCHAR(20) NOT NULL UNIQUE,
    cotizacion_id INT NULL,
    cliente_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha_emision DATE NOT NULL,
    fecha_confirmacion DATE NULL,
    fecha_pago DATE NULL,
    fecha_entrega DATE NULL,
    condicion_pago ENUM('CONTADO','CREDITO_15','CREDITO_30','CREDITO_45') DEFAULT 'CONTADO',
    moneda ENUM('SOLES','USD') DEFAULT 'SOLES',
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    descuento DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    igv DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estado ENUM('PENDIENTE','CONFIRMADO','PAGADO','PREPARANDO','ENTREGADO','CANCELADO') DEFAULT 'PENDIENTE',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id) ON DELETE SET NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_emision),
    INDEX idx_numero (numero)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 9. DETALLE PEDIDOS
-- ============================================================
CREATE TABLE IF NOT EXISTS detalle_pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(150) NOT NULL,
    cantidad INT NOT NULL,
    unidad ENUM('unidad','par','doc','pack','caja') DEFAULT 'unidad',
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    importe DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 10. FACTURAS
-- ============================================================
CREATE TABLE IF NOT EXISTS facturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serie VARCHAR(4) NOT NULL,
    correlativo INT NOT NULL,
    numero VARCHAR(20) NOT NULL UNIQUE,
    pedido_id INT NULL,
    cliente_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo ENUM('FACTURA','BOLETA','NOTA_CREDITO') DEFAULT 'FACTURA',
    fecha_emision DATE NOT NULL,
    moneda ENUM('SOLES','USD') DEFAULT 'SOLES',
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    descuento DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    igv DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estado ENUM('EMITIDA','ANULADA') DEFAULT 'EMITIDA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_fecha (fecha_emision),
    INDEX idx_numero (numero)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 11. DETALLE FACTURAS
-- ============================================================
CREATE TABLE IF NOT EXISTS detalle_facturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    factura_id INT NOT NULL,
    producto_id INT NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(150) NOT NULL,
    cantidad INT NOT NULL,
    unidad ENUM('unidad','par','doc','pack','caja') DEFAULT 'unidad',
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    importe DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 12. PAGOS
-- ============================================================
CREATE TABLE IF NOT EXISTS pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha DATE NOT NULL,
    metodo_pago ENUM('EFECTIVO','TRANSFERENCIA','YAPE','PLIN','TARJETA') DEFAULT 'TRANSFERENCIA',
    referencia VARCHAR(100),
    usuario_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_pedido (pedido_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 13. MOVIMIENTOS DE INVENTARIO
-- ============================================================
CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo ENUM('ENTRADA','SALIDA','AJUSTE') NOT NULL,
    cantidad INT NOT NULL,
    pedido_id INT NULL,
    factura_id INT NULL,
    usuario_id INT NOT NULL,
    comentario VARCHAR(200),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL,
    FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE SET NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_producto (producto_id),
    INDEX idx_fecha (fecha),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 14. HISTORIAL DE DOCUMENTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS historial_documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_documento ENUM('COTIZACION','PEDIDO','FACTURA') NOT NULL,
    documento_id INT NOT NULL,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    usuario_id INT NOT NULL,
    comentario VARCHAR(200),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_documento (tipo_documento, documento_id),
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 15. DATOS DE PRUEBA
-- ============================================================

-- Admin (password: admin123)
INSERT INTO usuarios (username, password, email, rol, activo) VALUES 
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@carimport.com', 'ADMIN', TRUE);

-- Cliente de prueba
INSERT INTO clientes (nombre, documento, direccion, telefono, email) VALUES 
('Juan Pérez', '10421868391', 'Jr. Palmeras 231', '987654321', 'juan@email.com');

-- Importadoras
INSERT INTO importadoras (ruc, razon_social, telefono) VALUES 
('20554433221', 'Frenos y Luces del Pacífico S.A.C.', '987654321'),
('20112233445', 'Autopartes Globales Lima E.I.R.L.', '912345678');

-- Productos de prueba
INSERT INTO productos (codigo_sku, nombre, descripcion, precio_compra, precio_venta, stock, stock_minimo, unidad_medida) VALUES 
('SKU-LED-H7', 'Kit de Luces LED H7', 'Luces LED blancas de 12000LM', 80.00, 120.00, 45, 5, 'par'),
('SKU-DIS-DEL', 'Pastillas de Freno Delanteras', 'Pastillas cerámicas de alta durabilidad', 55.00, 85.50, 30, 5, 'unidad'),
('SKU-FIL-ACE', 'Filtro de Aceite Premium', 'Filtro de flujo avanzado', 22.00, 35.00, 120, 10, 'unidad'),
('SKU-AMR-TRAS', 'Amortiguador Trasero Reforzado', 'Amortiguador de gas de alto confort', 140.00, 195.00, 25, 3, 'unidad'),
('SKU-BUJ-IRID', 'Bujía de Iridio Larga Duración', 'Bujías de alto rendimiento térmico', 18.00, 28.00, 200, 20, 'unidad');

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
SHOW TABLES;