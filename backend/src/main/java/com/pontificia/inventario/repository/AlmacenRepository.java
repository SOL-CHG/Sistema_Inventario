package com.pontificia.inventario.repository;

import com.pontificia.inventario.entity.Almacen;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de Almacen. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface AlmacenRepository extends JpaRepository<Almacen, Long> {
}
