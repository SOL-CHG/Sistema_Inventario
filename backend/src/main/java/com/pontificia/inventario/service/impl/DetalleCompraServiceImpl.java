package com.pontificia.inventario.service.impl;

import com.pontificia.inventario.entity.DetalleCompra;
import com.pontificia.inventario.repository.DetalleCompraRepository;
import com.pontificia.inventario.service.DetalleCompraService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DetalleCompraServiceImpl implements DetalleCompraService {

    private final DetalleCompraRepository repository;

    public DetalleCompraServiceImpl(DetalleCompraRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DetalleCompra> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public DetalleCompra buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public DetalleCompra guardar(DetalleCompra entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
