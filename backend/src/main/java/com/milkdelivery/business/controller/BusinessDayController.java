package com.milkdelivery.business.controller;

import com.milkdelivery.business.dto.BusinessDayResponse;
import com.milkdelivery.business.dto.BusinessDaySummaryResponse;
import com.milkdelivery.business.service.BusinessDayService;
import com.milkdelivery.business.service.BusinessSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/business-day")
@RequiredArgsConstructor
public class BusinessDayController {

    private final BusinessDayService businessDayService;
    private final BusinessSummaryService businessSummaryService;

    @GetMapping("/today")
    public ResponseEntity<BusinessDayResponse> getTodayBusinessDay() {

        return ResponseEntity.ok(
                businessDayService.getTodayBusinessDay()
        );

    }

    @GetMapping("/summary")
    public ResponseEntity<BusinessDaySummaryResponse> getSummary() {

        return ResponseEntity.ok(
                businessSummaryService.getTodaySummary()
        );

    }

    @PostMapping("/start")
    public ResponseEntity<Void> startBusinessDay() {

        businessDayService.startBusinessDay();

        return ResponseEntity.ok().build();

    }

    @PostMapping("/generate-orders")
    public ResponseEntity<Void> generateTodayOrders() {

        businessDayService.generateTodayOrders();

        return ResponseEntity.ok().build();

    }

    @PostMapping("/close")
    public ResponseEntity<Void> closeBusinessDay() {

        businessDayService.closeBusinessDay();

        return ResponseEntity.ok().build();

    }

}