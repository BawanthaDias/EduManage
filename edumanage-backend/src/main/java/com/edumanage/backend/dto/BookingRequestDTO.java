package com.edumanage.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequestDTO {
    @NotNull
    private Long userId;
    
    @NotNull
    private Long resourceId;
    
    @NotNull
    private LocalDate date;
    
    @NotNull
    private LocalTime startTime;
    
    @NotNull
    private LocalTime endTime;
    
    @NotNull
    private String purpose;
    
    @NotNull
    private Integer attendees;
}
