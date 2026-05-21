package com.Team5.mqtt.controllers;

import com.Team5.mqtt.dto.TelemetryRequest;
import com.Team5.mqtt.entity.TelemetryData;
import com.Team5.mqtt.services.TelemetryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/telemetry")
public class TelemetryController {

    private final TelemetryService telemetryService;

    public TelemetryController(TelemetryService telemetryService) {
        this.telemetryService = telemetryService;
    }

    @PostMapping("/saveData")
    public ResponseEntity<?> ingest(@RequestBody TelemetryRequest request) {
        List<String> errors = telemetryService.validate(request);
        if (!errors.isEmpty()) {
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(telemetryService.save(request), HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<TelemetryData>> getAll() {
        return ResponseEntity.ok(telemetryService.getAll());
    }

    @GetMapping("/device/{deviceId}")
    public ResponseEntity<List<TelemetryData>> getByDevice(@PathVariable String deviceId) {
        return ResponseEntity.ok(telemetryService.getByDeviceId(deviceId));
    }


    @GetMapping("/metric/{metric}")
    public ResponseEntity<List<TelemetryData>> getByMetric(
            @PathVariable String metric,
            @RequestParam(required = false) String location) {

        if (location != null && !location.isEmpty()) {
            return ResponseEntity.ok(
                    telemetryService.getByMetricAndLocation(metric, location)
            );
        }
        return ResponseEntity.ok(telemetryService.getByMetric(metric));
    }
}