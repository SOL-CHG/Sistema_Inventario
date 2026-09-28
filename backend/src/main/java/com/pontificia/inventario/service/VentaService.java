package com.pontificia.inventario.service;

import com.pontificia.inventario.entity.Venta;

import java.util.List;

public interface VentaService {
    List<Venta> listarTodos();
    Venta buscarPorId(Long id);
    Venta guardar(Venta entidad);
    void eliminar(Long id);
}
