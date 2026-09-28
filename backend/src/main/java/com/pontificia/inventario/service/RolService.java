package com.pontificia.inventario.service;

import com.pontificia.inventario.entity.Rol;

import java.util.List;

public interface RolService {
    List<Rol> listarTodos();
    Rol buscarPorId(Long id);
    Rol guardar(Rol entidad);
    void eliminar(Long id);
}
