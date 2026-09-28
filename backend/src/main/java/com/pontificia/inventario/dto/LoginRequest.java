package com.pontificia.inventario.dto;

/**
 * DTO de entrada para el login (POST /api/auth/login).
 */
public class LoginRequest {

    private String username;
    private String password;

    public LoginRequest() {
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
