package com.Team5.mqtt.controllers;

import com.Team5.mqtt.entity.Alert;
import com.Team5.mqtt.repositories.AlertRepository;
import com.Team5.mqtt.services.AlertService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertService.findAll();
    }
}