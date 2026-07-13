package com.milkdelivery.address.repository;

import com.milkdelivery.address.entity.Address;
import com.milkdelivery.user.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository
        extends JpaRepository<Address, Long> {

    List<Address> findByUserAndActiveTrue(
            User user
    );

    long countByUserAndActiveTrue(
            User user
    );

    Optional<Address> findFirstByUserAndActiveTrueOrderByIdAsc(
            User user
    );

    /*
     * Keep existing methods temporarily
     * so existing services continue to compile.
     */

    default List<Address> findByUser(
            User user
    ) {
        return findByUserAndActiveTrue(user);
    }

    default long countByUser(
            User user
    ) {
        return countByUserAndActiveTrue(user);
    }

    default Optional<Address> findFirstByUser(
            User user
    ) {
        return findFirstByUserAndActiveTrueOrderByIdAsc(user);
    }
}