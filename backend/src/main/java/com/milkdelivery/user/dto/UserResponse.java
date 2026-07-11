package com.milkdelivery.user.dto;

import com.milkdelivery.user.entity.Role;

public class UserResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private Role role;

    public UserResponse() {
    }

    public UserResponse(
            Long id,
            String fullName,
            String email,
            String phoneNumber,
            Role role
    ) {

        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;

    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public Role getRole() {
        return role;
    }

}