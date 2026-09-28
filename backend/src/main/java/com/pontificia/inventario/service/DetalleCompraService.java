package com.pontificia.inventario.service;

import com.pontificia.inventario.entity.DetalleCompra;

import java.util.List;

public interface DetalleCompraService {
    List<DetalleCompra> listarTodos();
    DetalleCompra buscarPorId(Long id);
    DetalleCompra guardar(DetalleCompra entidad);
    void eliminar(Long id);
}
