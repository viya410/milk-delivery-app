package com.milkdelivery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class MilkDeliveryBackendApplication {

	public static void main(String[] args) {

		TimeZone.setDefault(
				TimeZone.getTimeZone("Asia/Kolkata")
		);

		System.out.println(
				"TIMEZONE = " +
						TimeZone.getDefault().getID()
		);

		SpringApplication.run(
				MilkDeliveryBackendApplication.class,
				args
		);
	}
}