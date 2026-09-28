package com.pontificia.inventario.dto;

/**
 * DTO de salida del login: datos minimos del usuario autenticado,
 * sin exponer la contraseña.
 */
public class LoginResponse {

    private Long idUsuario;
    private String nombreCompleto;
    private String username;
    private String rolNombre;

    public LoginResponse() {
    }

    public LoginResponse(Long idUsuario, String nombreCompleto, String username, String rolNombre) {
        this.idUsuario = idUsuario;
        this.nombreCompleto = nombreCompleto;
        this.username = username;
        this.rolNombre = rolNombre;
    }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRolNombre() { return rolNombre; }
    public void setRolNombre(String rolNombre) { this.rolNombre = rolNombre; }
}
