package com.pontificia.inventario.repository;

import com.pontificia.inventario.entity.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de DetalleVenta. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
}
