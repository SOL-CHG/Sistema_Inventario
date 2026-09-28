package com.pontificia.inventario.service;

import com.pontificia.inventario.entity.Producto;

import java.util.List;

public interface ProductoService {
    List<Producto> listarTodos();
    Producto buscarPorId(Long id);
    Producto guardar(Producto entidad);
    void eliminar(Long id);

    /**
     * Regla de negocio: devuelve los productos cuyo stock actual
     * ya llego o esta por debajo de su stock minimo definido.
     * Sirve para la alerta de reabastecimiento.
     */
    List<Producto> listarStockBajo();

    /**
     * Regla de negocio: aumenta o disminuye el stock de un producto
     * (usado por compras, ventas y movimientos de inventario) y
     * guarda el cambio.
     */
    Producto ajustarStock(Long idProducto, int cantidad, boolean esEntrada);
}
