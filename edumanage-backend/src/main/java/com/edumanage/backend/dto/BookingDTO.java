package com.edumanage.backend.dto;

import com.edumanage.backend.model.BookingStatus;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Long resourceId;
    private String resourceName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer attendees;
    private BookingStatus status;
    private String rejectionReason;
}
