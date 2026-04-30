package com.edumanage.backend.dto;

import com.edumanage.backend.model.ResourceStatus;
import lombok.Data;

@Data
public class ResourceDTO {
    private Long id;
    private String name;
    private String type;
    private Integer capacity;
    private String location;
    private ResourceStatus status;
}
