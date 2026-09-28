package com.pontificia.inventario.service;

import com.pontificia.inventario.entity.MovimientoInventario;

import java.util.List;

public interface MovimientoInventarioService {
    List<MovimientoInventario> listarTodos();
    MovimientoInventario buscarPorId(Long id);
    MovimientoInventario guardar(MovimientoInventario entidad);
    void eliminar(Long id);
}
