package com.pontificia.inventario.service;

import com.pontificia.inventario.entity.Compra;

import java.util.List;

public interface CompraService {
    List<Compra> listarTodos();
    Compra buscarPorId(Long id);
    Compra guardar(Compra entidad);
    void eliminar(Long id);
}
