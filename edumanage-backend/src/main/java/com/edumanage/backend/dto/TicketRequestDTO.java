package com.edumanage.backend.dto;

import com.edumanage.backend.model.TicketPriority;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketRequestDTO {
    @NotNull
    private Long userId;

    private Long resourceId;

    @NotNull
    private String category;

    @NotNull
    private String description;

    @NotNull
    private TicketPriority priority;
}
