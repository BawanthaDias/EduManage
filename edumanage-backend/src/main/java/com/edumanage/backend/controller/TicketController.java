package com.edumanage.backend.controller;

import com.edumanage.backend.dto.TicketDTO;
import com.edumanage.backend.dto.TicketRequestDTO;
import com.edumanage.backend.model.TicketPriority;
import com.edumanage.backend.model.TicketStatus;
import com.edumanage.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public ResponseEntity<List<TicketDTO>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDTO> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketDTO>> getUserTickets(@PathVariable Long userId) {
        return ResponseEntity.ok(ticketService.getUserTickets(userId));
    }

    @PostMapping
    public ResponseEntity<TicketDTO> createTicket(
            @RequestParam("userId") Long userId,
            @RequestParam(value = "resourceId", required = false) Long resourceId,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("priority") TicketPriority priority,
            @RequestParam(value = "images", required = false) MultipartFile[] images) {
        
        TicketRequestDTO request = new TicketRequestDTO();
        request.setUserId(userId);
        request.setResourceId(resourceId);
        request.setCategory(category);
        request.setDescription(description);
        request.setPriority(priority);

        return ResponseEntity.ok(ticketService.createTicket(request, images));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TicketDTO> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, status));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<TicketDTO> assignTechnician(
            @PathVariable Long id,
            @RequestParam Long technicianId) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, technicianId));
    }
}
