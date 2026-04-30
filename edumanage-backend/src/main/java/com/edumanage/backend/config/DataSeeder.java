package com.edumanage.backend.config;

import com.edumanage.backend.model.*;
import com.edumanage.backend.repository.ResourceRepository;
import com.edumanage.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setEmail("admin@edumanage.com");
            admin.setName("Admin User");
            admin.setPassword("password123");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);

            User user = new User();
            user.setEmail("student@edumanage.com");
            user.setName("Demo Student");
            user.setPassword("password123");
            user.setRole(Role.USER);
            userRepository.save(user);
        }

        if (resourceRepository.count() == 0) {
            Resource r1 = new Resource();
            r1.setName("Main Lecture Hall A");
            r1.setType("LECTURE_HALL");
            r1.setCapacity(200);
            r1.setLocation("Building 1, Floor 2");
            r1.setStatus(ResourceStatus.ACTIVE);
            resourceRepository.save(r1);

            Resource r2 = new Resource();
            r2.setName("Computer Lab 3");
            r2.setType("LAB");
            r2.setCapacity(40);
            r2.setLocation("Building 2, Floor 1");
            r2.setStatus(ResourceStatus.ACTIVE);
            resourceRepository.save(r2);

            Resource r3 = new Resource();
            r3.setName("Projector XYZ");
            r3.setType("EQUIPMENT");
            r3.setCapacity(0);
            r3.setLocation("IT Store");
            r3.setStatus(ResourceStatus.OUT_OF_SERVICE);
            resourceRepository.save(r3);
        }
    }
}
