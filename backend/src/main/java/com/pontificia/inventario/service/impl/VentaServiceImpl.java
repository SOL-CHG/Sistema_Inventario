package com.pontificia.inventario.service.impl;

import com.pontificia.inventario.entity.Venta;
import com.pontificia.inventario.repository.VentaRepository;
import com.pontificia.inventario.service.VentaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class VentaServiceImpl implements VentaService {

    private final VentaRepository repository;

    public VentaServiceImpl(VentaRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Venta> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Venta buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Venta guardar(Venta entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
