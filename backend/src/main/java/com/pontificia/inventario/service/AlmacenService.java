package com.pontificia.inventario.service;

import com.pontificia.inventario.entity.Almacen;

import java.util.List;

public interface AlmacenService {
    List<Almacen> listarTodos();
    Almacen buscarPorId(Long id);
    Almacen guardar(Almacen entidad);
    void eliminar(Long id);
}
