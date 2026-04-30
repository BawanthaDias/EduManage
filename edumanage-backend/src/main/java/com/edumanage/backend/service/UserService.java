package com.edumanage.backend.service;

import com.edumanage.backend.dto.AuthRequest;
import com.edumanage.backend.dto.RegisterRequest;
import com.edumanage.backend.model.Role;
import com.edumanage.backend.model.User;
import com.edumanage.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public User registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        // For a production app, use PasswordEncoder here. We use plain text for simplicity per request.
        user.setPassword(request.getPassword());
        user.setRole(request.getRole() != null ? request.getRole() : Role.USER);

        return userRepository.save(user);
    }

    public User authenticateUser(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}
