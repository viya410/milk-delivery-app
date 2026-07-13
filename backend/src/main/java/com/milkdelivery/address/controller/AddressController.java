package com.milkdelivery.address.controller;

import com.milkdelivery.address.entity.Address;
import com.milkdelivery.address.repository.AddressRepository;
import com.milkdelivery.user.entity.User;
import com.milkdelivery.user.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    private final AddressRepository addressRepository;

    private final UserRepository userRepository;

    public AddressController(
            AddressRepository addressRepository,
            UserRepository userRepository
    ) {

        this.addressRepository = addressRepository;

        this.userRepository = userRepository;
    }

    private User getCurrentUser(
            Authentication authentication
    ) {

        String username =
                authentication.getName();

        return userRepository

                .findByEmail(username)

                .or(() ->

                        userRepository.findByPhoneNumber(
                                username
                        )

                )

                .orElseThrow();
    }

    @PostMapping
    public ResponseEntity<Void> saveAddress(

            @RequestBody Address address,

            Authentication authentication

    ) {

        User user =
                getCurrentUser(authentication);

        address.setUser(user);

        address.setActive(true);

        addressRepository.save(address);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public Address getAddress(

            @PathVariable Long id,

            Authentication authentication

    ) {

        User user =
                getCurrentUser(authentication);

        Address address =
                addressRepository

                        .findById(id)

                        .orElseThrow();

        if (!address.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "Address does not belong to current user."
            );
        }

        return address;
    }

    @GetMapping
    public List<Address> getAddresses(

            Authentication authentication

    ) {

        User user =
                getCurrentUser(authentication);

        return addressRepository
                .findByUserAndActiveTrue(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(

            @PathVariable Long id,

            Authentication authentication

    ) {

        User user =
                getCurrentUser(authentication);

        Address address =
                addressRepository

                        .findById(id)

                        .orElseThrow();

        if (!address.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "Address does not belong to current user."
            );
        }

        address.setActive(false);

        addressRepository.save(address);

        return ResponseEntity.noContent().build();
    }
}