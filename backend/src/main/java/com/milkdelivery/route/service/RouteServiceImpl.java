package com.milkdelivery.route.service;

import com.milkdelivery.address.repository.AddressRepository;
import com.milkdelivery.deliverypartner.repository.DeliveryPartnerRepository;
import com.milkdelivery.exception.RouteAlreadyExistsException;
import com.milkdelivery.exception.RouteNotFoundException;
import com.milkdelivery.route.dto.request.CreateRouteRequest;
import com.milkdelivery.route.dto.response.RouteResponse;
import com.milkdelivery.route.entity.Route;
import com.milkdelivery.route.repository.RouteRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class RouteServiceImpl implements RouteService {

    private final RouteRepository routeRepository;
    private final AddressRepository addressRepository;
    private final DeliveryPartnerRepository deliveryPartnerRepository;

    public RouteServiceImpl(
            RouteRepository routeRepository,
            AddressRepository addressRepository,
            DeliveryPartnerRepository deliveryPartnerRepository
    ) {
        this.routeRepository = routeRepository;
        this.addressRepository = addressRepository;
        this.deliveryPartnerRepository = deliveryPartnerRepository;
    }

    @Override
    public RouteResponse createRoute(
            CreateRouteRequest request
    ) {

        validateCreateRequest(request);

        Route route = new Route();
        route.setRouteCode(request.getRouteCode());
        route.setRouteName(request.getRouteName());
        route.setDescription(request.getDescription());
        route.setActive(true);

        route = routeRepository.save(route);

        return mapToResponse(route);
    }

    @Override
    public List<RouteResponse> getAllRoutes() {

        return routeRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<RouteResponse> getAllActiveRoutes() {

        return routeRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public RouteResponse getRouteById(
            Long id
    ) {

        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RouteNotFoundException(id));

        return mapToResponse(route);
    }

    @Override
    public RouteResponse updateRoute(
            Long id,
            CreateRouteRequest request
    ) {

        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RouteNotFoundException(id));

        if (!route.getRouteCode().equals(request.getRouteCode())
                && routeRepository.existsByRouteCode(request.getRouteCode())) {

            throw new RouteAlreadyExistsException(
                    "route code",
                    request.getRouteCode()
            );
        }

        if (!route.getRouteName().equalsIgnoreCase(request.getRouteName())
                && routeRepository.existsByRouteName(request.getRouteName())) {

            throw new RouteAlreadyExistsException(
                    "route name",
                    request.getRouteName()
            );
        }

        route.setRouteCode(request.getRouteCode());
        route.setRouteName(request.getRouteName());
        route.setDescription(request.getDescription());

        route = routeRepository.save(route);

        return mapToResponse(route);
    }

    @Override
    public void deleteRoute(
            Long id
    ) {

        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RouteNotFoundException(id));

        boolean assignedToCustomer =
                addressRepository.existsByRoute(route);

        boolean assignedToDeliveryPartner =
                deliveryPartnerRepository.existsByRoute(route);

        if (assignedToCustomer || assignedToDeliveryPartner) {
            route.setActive(false);
            routeRepository.save(route);
            return;
        }

        routeRepository.delete(route);
    }

    private void validateCreateRequest(
            CreateRouteRequest request
    ) {

        if (routeRepository.existsByRouteCode(request.getRouteCode())) {
            throw new RouteAlreadyExistsException(
                    "route code",
                    request.getRouteCode()
            );
        }

        if (routeRepository.existsByRouteName(request.getRouteName())) {
            throw new RouteAlreadyExistsException(
                    "route name",
                    request.getRouteName()
            );
        }
    }

    private RouteResponse mapToResponse(
            Route route
    ) {

        RouteResponse response = new RouteResponse();

        response.setId(route.getId());
        response.setRouteCode(route.getRouteCode());
        response.setRouteName(route.getRouteName());
        response.setDescription(route.getDescription());
        response.setActive(route.isActive());

        return response;
    }
}