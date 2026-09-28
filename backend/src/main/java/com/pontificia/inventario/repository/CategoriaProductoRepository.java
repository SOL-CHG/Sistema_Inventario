package com.pontificia.inventario.repository;

import com.pontificia.inventario.entity.CategoriaProducto;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de CategoriaProducto. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface CategoriaProductoRepository extends JpaRepository<CategoriaProducto, Long> {
}
