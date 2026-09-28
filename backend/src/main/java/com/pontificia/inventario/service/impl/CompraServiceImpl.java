package com.pontificia.inventario.service.impl;

import com.pontificia.inventario.entity.Compra;
import com.pontificia.inventario.repository.CompraRepository;
import com.pontificia.inventario.service.CompraService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CompraServiceImpl implements CompraService {

    private final CompraRepository repository;

    public CompraServiceImpl(CompraRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Compra> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Compra buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Compra guardar(Compra entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
