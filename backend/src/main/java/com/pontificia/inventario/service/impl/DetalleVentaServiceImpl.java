package com.pontificia.inventario.service.impl;

import com.pontificia.inventario.entity.DetalleVenta;
import com.pontificia.inventario.repository.DetalleVentaRepository;
import com.pontificia.inventario.service.DetalleVentaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DetalleVentaServiceImpl implements DetalleVentaService {

    private final DetalleVentaRepository repository;

    public DetalleVentaServiceImpl(DetalleVentaRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DetalleVenta> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public DetalleVenta buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public DetalleVenta guardar(DetalleVenta entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
