package com.pontificia.inventario.service;

import com.pontificia.inventario.entity.CategoriaProducto;

import java.util.List;

public interface CategoriaProductoService {
    List<CategoriaProducto> listarTodos();
    CategoriaProducto buscarPorId(Long id);
    CategoriaProducto guardar(CategoriaProducto entidad);
    void eliminar(Long id);
}
