package com.pontificia.inventario.service.impl;

import com.pontificia.inventario.entity.Rol;
import com.pontificia.inventario.repository.RolRepository;
import com.pontificia.inventario.service.RolService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RolServiceImpl implements RolService {

    private final RolRepository repository;

    public RolServiceImpl(RolRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Rol> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Rol buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Rol guardar(Rol entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
