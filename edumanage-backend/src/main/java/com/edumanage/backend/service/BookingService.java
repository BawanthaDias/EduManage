package com.edumanage.backend.service;

import com.edumanage.backend.dto.BookingDTO;
import com.edumanage.backend.dto.BookingRequestDTO;
import com.edumanage.backend.model.Booking;
import com.edumanage.backend.model.BookingStatus;
import com.edumanage.backend.model.Resource;
import com.edumanage.backend.model.User;
import com.edumanage.backend.repository.BookingRepository;
import com.edumanage.backend.repository.ResourceRepository;
import com.edumanage.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<BookingDTO> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public BookingDTO createBooking(BookingRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        if (hasOverlap(resource.getId(), request.getDate(), request.getStartTime(), request.getEndTime())) {
            throw new RuntimeException("Resource is already booked for the selected time.");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResource(resource);
        booking.setDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setAttendees(request.getAttendees());
        booking.setStatus(BookingStatus.PENDING);

        booking = bookingRepository.save(booking);
        return mapToDTO(booking);
    }

    public BookingDTO updateBookingStatus(Long id, BookingStatus status, String rejectionReason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(status);
        if(status == BookingStatus.REJECTED && rejectionReason != null) {
            booking.setRejectionReason(rejectionReason);
        }
        
        booking = bookingRepository.save(booking);
        return mapToDTO(booking);
    }

    private boolean hasOverlap(Long resourceId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        List<Booking> resourceBookings = bookingRepository.findByResourceId(resourceId);
        return resourceBookings.stream()
                .filter(b -> b.getDate().equals(date))
                .filter(b -> b.getStatus() == BookingStatus.APPROVED || b.getStatus() == BookingStatus.PENDING)
                .anyMatch(b -> 
                    (startTime.isBefore(b.getEndTime()) && endTime.isAfter(b.getStartTime()))
                );
    }

    private BookingDTO mapToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser().getId());
        dto.setUserName(booking.getUser().getName());
        dto.setResourceId(booking.getResource().getId());
        dto.setResourceName(booking.getResource().getName());
        dto.setDate(booking.getDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setAttendees(booking.getAttendees());
        dto.setStatus(booking.getStatus());
        dto.setRejectionReason(booking.getRejectionReason());
        return dto;
    }
}
