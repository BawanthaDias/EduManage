package com.edumanage.backend.dto;

import com.edumanage.backend.model.TicketPriority;
import com.edumanage.backend.model.TicketStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TicketDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Long assignedTechnicianId;
    private Long resourceId;
    private String category;
    private String description;
    private TicketPriority priority;
    private TicketStatus status;
    private LocalDateTime createdAt;
    private List<String> imageUrls;
}
