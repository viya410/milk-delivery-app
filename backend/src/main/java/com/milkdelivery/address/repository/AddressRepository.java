package com.milkdelivery.address.repository;

import com.milkdelivery.address.entity.Address;
import com.milkdelivery.user.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository
        extends JpaRepository<Address, Long> {

    List<Address> findByUser(
            User user
    );

    long countByUser(
            User user
    );

}