package com.pontificia.inventario.service.impl;

import com.pontificia.inventario.entity.Almacen;
import com.pontificia.inventario.repository.AlmacenRepository;
import com.pontificia.inventario.service.AlmacenService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AlmacenServiceImpl implements AlmacenService {

    private final AlmacenRepository repository;

    public AlmacenServiceImpl(AlmacenRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Almacen> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Almacen buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Almacen guardar(Almacen entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
