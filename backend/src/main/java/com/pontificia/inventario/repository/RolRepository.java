package com.pontificia.inventario.repository;

import com.pontificia.inventario.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de Rol. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface RolRepository extends JpaRepository<Rol, Long> {
}
