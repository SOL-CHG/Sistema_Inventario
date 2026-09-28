package com.pontificia.inventario.repository;

import com.pontificia.inventario.entity.DetalleCompra;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de DetalleCompra. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Long> {
}
