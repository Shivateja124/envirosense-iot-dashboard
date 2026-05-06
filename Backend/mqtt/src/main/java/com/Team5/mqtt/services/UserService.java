package com.Team5.mqtt.services;

import com.Team5.mqtt.dto.RegisterRequest;
import com.Team5.mqtt.entity.User;
import com.Team5.mqtt.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String registerUser(RegisterRequest request) {
        if (repo.findByUsername(request.getUsername()).isPresent()) {
            return "User already exists";
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "ROLE_USER");
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        repo.save(user);
        return "User registered successfully";
    }
}