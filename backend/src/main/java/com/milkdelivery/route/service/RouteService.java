package com.milkdelivery.route.service;

import com.milkdelivery.route.dto.request.CreateRouteRequest;
import com.milkdelivery.route.dto.response.RouteResponse;

import java.util.List;

public interface RouteService {

    RouteResponse createRoute(
            CreateRouteRequest request
    );

    List<RouteResponse> getAllRoutes();

    List<RouteResponse> getAllActiveRoutes();

    RouteResponse getRouteById(
            Long id
    );

    RouteResponse updateRoute(
            Long id,
            CreateRouteRequest request
    );

    void deleteRoute(
            Long id
    );
}