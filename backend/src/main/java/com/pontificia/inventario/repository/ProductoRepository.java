package com.pontificia.inventario.repository;

import com.pontificia.inventario.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de Producto. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
