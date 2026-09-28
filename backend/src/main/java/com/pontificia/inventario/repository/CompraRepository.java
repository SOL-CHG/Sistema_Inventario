package com.pontificia.inventario.repository;

import com.pontificia.inventario.entity.Compra;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de Compra. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface CompraRepository extends JpaRepository<Compra, Long> {
}
