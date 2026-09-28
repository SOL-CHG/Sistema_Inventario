package com.pontificia.inventario.repository;

import com.pontificia.inventario.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de Venta. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface VentaRepository extends JpaRepository<Venta, Long> {
}
