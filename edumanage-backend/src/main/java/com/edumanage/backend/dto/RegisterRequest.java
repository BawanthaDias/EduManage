package com.edumanage.backend.dto;

import com.edumanage.backend.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role; // Optional, usually defaults to USER
}
