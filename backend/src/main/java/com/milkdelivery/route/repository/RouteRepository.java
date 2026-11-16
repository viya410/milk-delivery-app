package com.milkdelivery.route.repository;

import com.milkdelivery.route.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RouteRepository extends JpaRepository<Route, Long> {

    Optional<Route> findByRouteCode(
            String routeCode
    );

    Optional<Route> findByRouteName(
            String routeName
    );

    boolean existsByRouteCode(
            String routeCode
    );

    boolean existsByRouteName(
            String routeName
    );

    List<Route> findByActiveTrue();

}