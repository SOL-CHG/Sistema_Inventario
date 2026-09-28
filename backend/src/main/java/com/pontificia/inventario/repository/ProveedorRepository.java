package com.pontificia.inventario.repository;

import com.pontificia.inventario.entity.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de Proveedor. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
}
