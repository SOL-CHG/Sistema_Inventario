package com.pontificia.inventario.repository;

import com.pontificia.inventario.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio JPA de Cliente. Hereda operaciones CRUD basicas
 * (save, findAll, findById, deleteById, etc.) de JpaRepository.
 */
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
