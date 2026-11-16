package com.milkdelivery.route.dto.response;

public class RouteResponse {

    private Long id;

    private String routeCode;

    private String routeName;

    private String description;

    private boolean active;

    public RouteResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(
            Long id
    ) {
        this.id = id;
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

    public boolean isActive() {
        return active;
    }

    public void setActive(
            boolean active
    ) {
        this.active = active;
    }

}