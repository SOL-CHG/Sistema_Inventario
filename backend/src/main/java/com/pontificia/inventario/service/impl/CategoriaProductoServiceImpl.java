package com.pontificia.inventario.service.impl;

import com.pontificia.inventario.entity.CategoriaProducto;
import com.pontificia.inventario.repository.CategoriaProductoRepository;
import com.pontificia.inventario.service.CategoriaProductoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoriaProductoServiceImpl implements CategoriaProductoService {

    private final CategoriaProductoRepository repository;

    public CategoriaProductoServiceImpl(CategoriaProductoRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaProducto> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoriaProducto buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public CategoriaProducto guardar(CategoriaProducto entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
