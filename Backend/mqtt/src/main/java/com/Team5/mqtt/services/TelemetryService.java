package com.Team5.mqtt.services;

import com.Team5.mqtt.dto.TelemetryRequest;
import com.Team5.mqtt.entity.Device;
import com.Team5.mqtt.entity.TelemetryData;
import com.Team5.mqtt.repositories.DeviceRepository;
import com.Team5.mqtt.repositories.TelemetryRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TelemetryService {

    private final TelemetryRepository telemetryRepository;
    private final DeviceRepository deviceRepository;
    private final AlertService alertService;

    public TelemetryService(TelemetryRepository telemetryRepository,
                            DeviceRepository deviceRepository,
                            AlertService alertService) {
        this.telemetryRepository = telemetryRepository;
        this.deviceRepository = deviceRepository;
        this.alertService = alertService;
    }

    public List<String> validate(TelemetryRequest request) {

        List<String> errors = new ArrayList<>();

        if (request.getDeviceId() == null || request.getDeviceId().trim().isEmpty()) {
            errors.add("deviceId is required");
        } else {
            Optional<Device> device = deviceRepository.findById(request.getDeviceId());
            if (device.isEmpty()) {
                errors.add("Device not found: " + request.getDeviceId());
            } else if ("INACTIVE".equals(device.get().getStatus())) {
                errors.add("Device is INACTIVE: " + request.getDeviceId());
            }
        }

        if (request.getMetric() == null || request.getMetric().trim().isEmpty()) {
            errors.add("metric is required");
        }

        if (request.getValue() == null) {
            errors.add("value is required");
        }

        if (request.getTimestamp() == null) {
            errors.add("timestamp is required");
        }

        return errors;
    }

    public TelemetryData save(TelemetryRequest request) {

        Device device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() ->
                        new RuntimeException("Device not found: " + request.getDeviceId()));

        TelemetryData data = new TelemetryData();
        data.setMetric(request.getMetric());
        data.setValue(request.getValue());
        data.setTimestamp(request.getTimestamp());
        data.setDevice(device);

        TelemetryData saved = telemetryRepository.save(data);
        alertService.checkAndCreateAlert(saved);
        return saved;
    }

    public List<TelemetryData> getAll() {
        return telemetryRepository.findAll();
    }

    public List<TelemetryData> getByDeviceId(String deviceId) {
        return telemetryRepository.findByDeviceDeviceId(deviceId);
    }

    public List<TelemetryData> getByMetric(String metric) {
        return telemetryRepository.findByMetric(metric);
    }

    public List<TelemetryData> getByMetricAndLocation(String metric, String location) {
        return telemetryRepository.findByMetricAndDeviceLocationAndDeviceStatus(metric, location, "ACTIVE");
    }
}