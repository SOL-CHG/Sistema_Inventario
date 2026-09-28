package com.pontificia.inventario.service;

import com.pontificia.inventario.entity.Cliente;

import java.util.List;

public interface ClienteService {
    List<Cliente> listarTodos();
    Cliente buscarPorId(Long id);
    Cliente guardar(Cliente entidad);
    void eliminar(Long id);
}
