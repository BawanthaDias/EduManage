package com.edumanage.backend.service;

import com.edumanage.backend.dto.TicketDTO;
import com.edumanage.backend.dto.TicketRequestDTO;
import com.edumanage.backend.model.*;
import com.edumanage.backend.repository.ResourceRepository;
import com.edumanage.backend.repository.TicketRepository;
import com.edumanage.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final FileStorageService fileStorageService;

    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<TicketDTO> getUserTickets(Long userId) {
        return ticketRepository.findByUserId(userId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public TicketDTO getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        return mapToDTO(ticket);
    }

    public TicketDTO createTicket(TicketRequestDTO request, MultipartFile[] images) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Resource resource = null;
        if (request.getResourceId() != null) {
            resource = resourceRepository.findById(request.getResourceId())
                    .orElseThrow(() -> new RuntimeException("Resource not found"));
        }

        Ticket ticket = new Ticket();
        ticket.setUser(user);
        ticket.setResource(resource);
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setImages(new ArrayList<>());

        if (images != null && images.length > 0) {
            if (images.length > 3) {
                throw new RuntimeException("Maximum 3 images allowed.");
            }
            for (MultipartFile file : images) {
                String fileName = fileStorageService.storeFile(file);
                TicketImage ticketImage = new TicketImage();
                ticketImage.setImageUrl("/uploads/tickets/" + fileName);
                ticketImage.setTicket(ticket);
                ticket.getImages().add(ticketImage);
            }
        }

        ticket = ticketRepository.save(ticket);
        return mapToDTO(ticket);
    }

    public TicketDTO updateTicketStatus(Long id, TicketStatus status) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        ticket = ticketRepository.save(ticket);
        return mapToDTO(ticket);
    }

    public TicketDTO assignTechnician(Long ticketId, Long technicianId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));
        User technician = userRepository.findById(technicianId).orElseThrow(() -> new RuntimeException("User not found"));
        
        if(technician.getRole() != Role.TECHNICIAN && technician.getRole() != Role.ADMIN) {
             throw new RuntimeException("Assigned user is not a technician or admin");
        }

        ticket.setAssignedTechnician(technician);
        ticket = ticketRepository.save(ticket);
        return mapToDTO(ticket);
    }

    private TicketDTO mapToDTO(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setId(ticket.getId());
        dto.setUserId(ticket.getUser().getId());
        dto.setUserName(ticket.getUser().getName());
        
        if (ticket.getAssignedTechnician() != null) {
            dto.setAssignedTechnicianId(ticket.getAssignedTechnician().getId());
        }
        if (ticket.getResource() != null) {
            dto.setResourceId(ticket.getResource().getId());
        }
        
        dto.setCategory(ticket.getCategory());
        dto.setDescription(ticket.getDescription());
        dto.setPriority(ticket.getPriority());
        dto.setStatus(ticket.getStatus());
        dto.setCreatedAt(ticket.getCreatedAt());
        
        if (ticket.getImages() != null) {
            dto.setImageUrls(ticket.getImages().stream().map(TicketImage::getImageUrl).collect(Collectors.toList()));
        }
        return dto;
    }
}
