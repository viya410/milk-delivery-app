package com.milkdelivery.route.controller;

import com.milkdelivery.route.dto.request.CreateRouteRequest;
import com.milkdelivery.route.dto.response.RouteResponse;
import com.milkdelivery.route.service.RouteService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/routes")
public class RouteController {

    private final RouteService routeService;

    public RouteController(
            RouteService routeService
    ) {
        this.routeService = routeService;
    }

    @PostMapping
    public RouteResponse createRoute(
            @Valid @RequestBody CreateRouteRequest request
    ) {

        return routeService.createRoute(request);
    }

    @GetMapping
    public List<RouteResponse> getAllRoutes() {

        return routeService.getAllRoutes();
    }

    @GetMapping("/{id}")
    public RouteResponse getRouteById(
            @PathVariable Long id
    ) {

        return routeService.getRouteById(id);
    }

    @PutMapping("/{id}")
    public RouteResponse updateRoute(
            @PathVariable Long id,
            @Valid @RequestBody CreateRouteRequest request
    ) {

        return routeService.updateRoute(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteRoute(
            @PathVariable Long id
    ) {

        routeService.deleteRoute(id);
    }
}