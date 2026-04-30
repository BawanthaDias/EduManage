package com.edumanage.backend.service;

import com.edumanage.backend.dto.ResourceDTO;
import com.edumanage.backend.model.Resource;
import com.edumanage.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public List<ResourceDTO> getAllResources() {
        return resourceRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ResourceDTO getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id).orElseThrow(() -> new RuntimeException("Resource not found"));
        return mapToDTO(resource);
    }

    public ResourceDTO createResource(ResourceDTO resourceDTO) {
        Resource resource = new Resource();
        resource.setName(resourceDTO.getName());
        resource.setType(resourceDTO.getType());
        resource.setCapacity(resourceDTO.getCapacity());
        resource.setLocation(resourceDTO.getLocation());
        if(resourceDTO.getStatus() != null) {
            resource.setStatus(resourceDTO.getStatus());
        }
        resource = resourceRepository.save(resource);
        return mapToDTO(resource);
    }

    public ResourceDTO updateResource(Long id, ResourceDTO resourceDTO) {
        Resource resource = resourceRepository.findById(id).orElseThrow(() -> new RuntimeException("Resource not found"));
        resource.setName(resourceDTO.getName());
        resource.setType(resourceDTO.getType());
        resource.setCapacity(resourceDTO.getCapacity());
        resource.setLocation(resourceDTO.getLocation());
        if(resourceDTO.getStatus() != null) {
            resource.setStatus(resourceDTO.getStatus());
        }
        resource = resourceRepository.save(resource);
        return mapToDTO(resource);
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }

    private ResourceDTO mapToDTO(Resource resource) {
        ResourceDTO dto = new ResourceDTO();
        dto.setId(resource.getId());
        dto.setName(resource.getName());
        dto.setType(resource.getType());
        dto.setCapacity(resource.getCapacity());
        dto.setLocation(resource.getLocation());
        dto.setStatus(resource.getStatus());
        return dto;
    }
}
