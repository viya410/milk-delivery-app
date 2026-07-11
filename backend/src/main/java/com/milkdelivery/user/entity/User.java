package com.milkdelivery.user.entity;

import jakarta.persistence.*;
import com.milkdelivery.user.entity.Role;
import com.milkdelivery.address.entity.Address;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true)
    private String email;

    @Column(
            unique = true,
            nullable = false
    )
    private String phoneNumber;

    @Column(nullable = false)
    @JsonIgnore
    private String password;


    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL
    )
    private List<Address> addresses;

    @Enumerated(
            EnumType.STRING
    )
    @Column(
            nullable = false
    )
    private Role role;

    public User() {
    }
    public List<Address> getAddresses() {
        return addresses;
    }

    public void setAddresses(
            List<Address> addresses
    ) {
        this.addresses = addresses;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(
            String fullName
    ) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email
    ) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(
            String phoneNumber
    ) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(
            String password
    ) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(
            Role role
    ) {
        this.role = role;
    }

}