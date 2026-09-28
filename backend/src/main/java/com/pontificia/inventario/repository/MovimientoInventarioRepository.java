package com.pontificia.inventario.repository;

import com.pontificia.inventario.entity.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de MovimientoInventario. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {
}
