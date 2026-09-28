package com.pontificia.inventario.service.impl;

import com.pontificia.inventario.entity.Producto;
import com.pontificia.inventario.repository.ProductoRepository;
import com.pontificia.inventario.service.ProductoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository repository;

    public ProductoServiceImpl(ProductoRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> listarTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Producto buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Producto guardar(Producto entidad) {
        return repository.save(entidad);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> listarStockBajo() {
        return repository.findAll().stream()
                .filter(p -> p.getStockActual() != null && p.getStockMinimo() != null
                        && p.getStockActual() <= p.getStockMinimo())
                .toList();
    }

    @Override
    public Producto ajustarStock(Long idProducto, int cantidad, boolean esEntrada) {
        Producto producto = repository.findById(idProducto)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + idProducto));

        int stockActual = producto.getStockActual() != null ? producto.getStockActual() : 0;
        int nuevoStock = esEntrada ? stockActual + cantidad : stockActual - cantidad;

        if (nuevoStock < 0) {
            throw new IllegalStateException("Stock insuficiente para el producto: " + producto.getNombre());
        }

        producto.setStockActual(nuevoStock);
        return repository.save(producto);
    }
}
