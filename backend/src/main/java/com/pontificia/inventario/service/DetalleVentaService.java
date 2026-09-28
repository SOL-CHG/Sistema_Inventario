package com.pontificia.inventario.service;

import com.pontificia.inventario.entity.DetalleVenta;

import java.util.List;

public interface DetalleVentaService {
    List<DetalleVenta> listarTodos();
    DetalleVenta buscarPorId(Long id);
    DetalleVenta guardar(DetalleVenta entidad);
    void eliminar(Long id);
}
