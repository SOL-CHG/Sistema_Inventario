-- =====================================================================
-- SISTEMA DE INVENTARIO PARA TIENDA - Script de Base de Datos (MySQL)
-- Proyecto academico: Programacion de Aplicaciones Web
-- Motor: MySQL 8.x  |  Charset: utf8mb4
-- =====================================================================

CREATE DATABASE IF NOT EXISTS inventario_db
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE inventario_db;

-- ---------------------------------------------------------------------
-- 1. TABLA: rol  (catalogo de roles del sistema)
-- ---------------------------------------------------------------------
CREATE TABLE rol (
    id_rol      BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(50)  NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. TABLA: usuario  (usuarios del sistema: admin, almacenero, vendedor)
-- ---------------------------------------------------------------------
CREATE TABLE usuario (
    id_usuario       BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo  VARCHAR(150) NOT NULL,
    username         VARCHAR(50)  NOT NULL UNIQUE,
    password         VARCHAR(255) NOT NULL,
    email            VARCHAR(100),
    id_rol           BIGINT NOT NULL,
    activo           TINYINT(1) DEFAULT 1,
    fecha_registro   DATE DEFAULT (CURRENT_DATE),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. TABLA: categoria_producto
-- ---------------------------------------------------------------------
CREATE TABLE categoria_producto (
    id_categoria BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL UNIQUE,
    descripcion  VARCHAR(255)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. TABLA: proveedor
-- ---------------------------------------------------------------------
CREATE TABLE proveedor (
    id_proveedor  BIGINT AUTO_INCREMENT PRIMARY KEY,
    ruc           VARCHAR(11)  NOT NULL UNIQUE,
    razon_social  VARCHAR(150) NOT NULL,
    telefono      VARCHAR(20),
    email         VARCHAR(100),
    direccion     VARCHAR(200)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. TABLA: almacen  (puntos de almacenamiento fisico)
-- ---------------------------------------------------------------------
CREATE TABLE almacen (
    id_almacen BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    ubicacion  VARCHAR(200),
    encargado  VARCHAR(100)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. TABLA: producto
-- ---------------------------------------------------------------------
CREATE TABLE producto (
    id_producto     BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo          VARCHAR(20)  NOT NULL UNIQUE,
    nombre          VARCHAR(150) NOT NULL,
    descripcion     VARCHAR(255),
    id_categoria    BIGINT NOT NULL,
    id_proveedor    BIGINT NOT NULL,
    precio_compra   DECIMAL(10,2) NOT NULL,
    precio_venta    DECIMAL(10,2) NOT NULL,
    stock_actual    INT DEFAULT 0,
    stock_minimo    INT DEFAULT 0,
    unidad_medida   VARCHAR(20) DEFAULT 'UND',
    estado          TINYINT(1) DEFAULT 1,
    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES categoria_producto(id_categoria),
    CONSTRAINT fk_producto_proveedor FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. TABLA: cliente
-- ---------------------------------------------------------------------
CREATE TABLE cliente (
    id_cliente        BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_documento  VARCHAR(15)  NOT NULL UNIQUE,
    nombres           VARCHAR(150) NOT NULL,
    telefono          VARCHAR(20),
    email             VARCHAR(100),
    direccion         VARCHAR(200)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8. TABLA: compra  (cabecera de compra a proveedor)
-- ---------------------------------------------------------------------
CREATE TABLE compra (
    id_compra    BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_proveedor BIGINT NOT NULL,
    id_usuario   BIGINT NOT NULL,
    fecha_compra DATE NOT NULL,
    total        DECIMAL(10,2) DEFAULT 0,
    estado       VARCHAR(20) DEFAULT 'REGISTRADA',
    CONSTRAINT fk_compra_proveedor FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor),
    CONSTRAINT fk_compra_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 9. TABLA: detalle_compra  (relacion N:M entre compra y producto)
-- ---------------------------------------------------------------------
CREATE TABLE detalle_compra (
    id_detalle_compra BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_compra         BIGINT NOT NULL,
    id_producto       BIGINT NOT NULL,
    cantidad          INT NOT NULL,
    precio_unitario   DECIMAL(10,2) NOT NULL,
    subtotal          DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detcompra_compra FOREIGN KEY (id_compra) REFERENCES compra(id_compra) ON DELETE CASCADE,
    CONSTRAINT fk_detcompra_producto FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 10. TABLA: venta  (cabecera de venta a cliente)
-- ---------------------------------------------------------------------
CREATE TABLE venta (
    id_venta    BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_cliente  BIGINT NOT NULL,
    id_usuario  BIGINT NOT NULL,
    fecha_venta DATE NOT NULL,
    total       DECIMAL(10,2) DEFAULT 0,
    estado      VARCHAR(20) DEFAULT 'REGISTRADA',
    CONSTRAINT fk_venta_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    CONSTRAINT fk_venta_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 11. TABLA: detalle_venta  (relacion N:M entre venta y producto)
-- ---------------------------------------------------------------------
CREATE TABLE detalle_venta (
    id_detalle_venta BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_venta         BIGINT NOT NULL,
    id_producto      BIGINT NOT NULL,
    cantidad         INT NOT NULL,
    precio_unitario  DECIMAL(10,2) NOT NULL,
    subtotal         DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detventa_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE,
    CONSTRAINT fk_detventa_producto FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 12. TABLA: movimiento_inventario  (kardex: entradas y salidas de stock)
-- ---------------------------------------------------------------------
CREATE TABLE movimiento_inventario (
    id_movimiento     BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_producto       BIGINT NOT NULL,
    id_almacen        BIGINT NOT NULL,
    id_usuario        BIGINT NOT NULL,
    tipo_movimiento   ENUM('ENTRADA','SALIDA') NOT NULL,
    cantidad          INT NOT NULL,
    fecha_movimiento  DATETIME DEFAULT CURRENT_TIMESTAMP,
    motivo            VARCHAR(200),
    CONSTRAINT fk_mov_producto FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    CONSTRAINT fk_mov_almacen FOREIGN KEY (id_almacen) REFERENCES almacen(id_almacen),
    CONSTRAINT fk_mov_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

-- =====================================================================
-- DATOS INICIALES (seed) para poder probar el sistema de inmediato
-- =====================================================================
INSERT INTO rol (nombre, descripcion) VALUES
 ('ADMIN', 'Administrador del sistema'),
 ('ALMACENERO', 'Encargado de almacen e inventario'),
 ('VENDEDOR', 'Encargado de ventas');

INSERT INTO usuario (nombre_completo, username, password, email, id_rol) VALUES
 ('Administrador General', 'admin', 'admin123', 'admin@tienda.com', 1);

INSERT INTO categoria_producto (nombre, descripcion) VALUES
 ('Abarrotes', 'Productos de consumo masivo'),
 ('Limpieza', 'Articulos de limpieza del hogar'),
 ('Bebidas', 'Bebidas gaseosas, jugos y agua');

INSERT INTO proveedor (ruc, razon_social, telefono, email, direccion) VALUES
 ('20123456789', 'Distribuidora Ayacucho S.A.C.', '966111222', 'ventas@distayacucho.com', 'Av. Mariscal Caceres 123, Ayacucho');

INSERT INTO almacen (nombre, ubicacion, encargado) VALUES
 ('Almacen Central', 'Jr. Lima 456, Ayacucho', 'Juan Perez');

INSERT INTO cliente (numero_documento, nombres, telefono, email, direccion) VALUES
 ('12345678', 'Maria Lopez Quispe', '987654321', 'maria.lopez@gmail.com', 'Jr. Sucre 789, Ayacucho');
