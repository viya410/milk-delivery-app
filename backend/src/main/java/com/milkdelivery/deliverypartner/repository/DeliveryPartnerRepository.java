package com.milkdelivery.deliverypartner.repository;

import com.milkdelivery.deliverypartner.entity.DeliveryPartner;
import com.milkdelivery.route.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeliveryPartnerRepository
        extends JpaRepository<DeliveryPartner, Long> {

    Optional<DeliveryPartner> findByEmployeeCode(
            String employeeCode
    );

    Optional<DeliveryPartner> findByUserId(
            Long userId
    );

    boolean existsByEmployeeCode(
            String employeeCode
    );

    boolean existsByUserId(
            Long userId
    );

    boolean existsByRoute(
            Route route
    );

}