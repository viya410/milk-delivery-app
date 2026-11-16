package com.milkdelivery.deliverypartner.entity;

import com.milkdelivery.route.entity.Route;
import com.milkdelivery.user.entity.User;
import jakarta.persistence.*;

@Entity
@Table(
        name = "delivery_partners",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "employee_code")
        }
)
public class DeliveryPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Column(
            name = "employee_code",
            unique = true,
            length = 20
    )
    private String employeeCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    private Route route;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryPartnerStatus status = DeliveryPartnerStatus.ACTIVE;

    public DeliveryPartner() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(
            User user
    ) {
        this.user = user;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(
            String employeeCode
    ) {
        this.employeeCode = employeeCode;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(
            Route route
    ) {
        this.route = route;
    }

    public DeliveryPartnerStatus getStatus() {
        return status;
    }

    public void setStatus(
            DeliveryPartnerStatus status
    ) {
        this.status = status;
    }
}