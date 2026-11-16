package com.milkdelivery.route.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateRouteRequest {

    @NotBlank(message = "Route code is required.")
    @Size(
            max = 20,
            message = "Route code cannot exceed 20 characters."
    )
    private String routeCode;

    @NotBlank(message = "Route name is required.")
    @Size(
            max = 100,
            message = "Route name cannot exceed 100 characters."
    )
    private String routeName;

    @Size(
            max = 500,
            message = "Description cannot exceed 500 characters."
    )
    private String description;

    public CreateRouteRequest() {
    }

    public String getRouteCode() {
        return routeCode;
    }

    public void setRouteCode(
            String routeCode
    ) {
        this.routeCode = routeCode;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(
            String routeName
    ) {
        this.routeName = routeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(
            String description
    ) {
        this.description = description;
    }
}