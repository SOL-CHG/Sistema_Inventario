package com.pontificia.inventario.service.impl;

import com.pontificia.inventario.entity.MovimientoInventario;
import com.pontificia.inventario.repository.MovimientoInventarioRepository;
import com.pontificia.inventario.service.MovimientoInventarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MovimientoInventarioServiceImpl implements MovimientoInventarioService {

    private final MovimientoInventarioRepository repository;

    public MovimientoInventarioServiceImpl(MovimientoInventarioRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventario> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public MovimientoInventario buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public MovimientoInventario guardar(MovimientoInventario entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
