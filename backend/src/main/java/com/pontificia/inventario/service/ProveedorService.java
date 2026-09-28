package com.pontificia.inventario.service;

import com.pontificia.inventario.entity.Proveedor;

import java.util.List;

public interface ProveedorService {
    List<Proveedor> listarTodos();
    Proveedor buscarPorId(Long id);
    Proveedor guardar(Proveedor entidad);
    void eliminar(Long id);
}
