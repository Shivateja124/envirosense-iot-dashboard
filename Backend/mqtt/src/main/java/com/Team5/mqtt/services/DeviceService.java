package com.Team5.mqtt.services;

import com.Team5.mqtt.entity.Device;
import com.Team5.mqtt.repositories.AlertRepository;
import com.Team5.mqtt.repositories.DeviceRepository;
import com.Team5.mqtt.repositories.TelemetryRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final TelemetryRepository telemetryRepository;
    private final AlertRepository alertRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public DeviceService(DeviceRepository deviceRepository,
                         TelemetryRepository telemetryRepository,
                         AlertRepository alertRepository) {
        this.deviceRepository    = deviceRepository;
        this.telemetryRepository = telemetryRepository;
        this.alertRepository     = alertRepository;
    }

    public List<String> validate(Device device) {
        List<String> errors = new ArrayList<>();
        if (device.getDeviceId() == null || device.getDeviceId().trim().isEmpty()) {
            errors.add("deviceId is required");
        } else if (deviceRepository.existsById(device.getDeviceId()))
            errors.add("Device ID already exists: " + device.getDeviceId());
        if (device.getName() == null || device.getName().trim().isEmpty())
            errors.add("name is required");
        if (device.getStatus() == null || (!device.getStatus().equals("ACTIVE") && !device.getStatus().equals("INACTIVE")))
            errors.add("status must be ACTIVE or INACTIVE");
        if (device.getType() == null || device.getType().trim().isEmpty())
            errors.add("type is required");
        return errors;
    }

    public Device save(Device device) {
        device.setRegisteredAt(
                java.time.LocalDateTime.now()
                        .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );
        return deviceRepository.save(device);
    }

    public List<Device> getAll() {
        return deviceRepository.findAll();
    }

    public Optional<Device> getById(String deviceId) {
        return deviceRepository.findById(deviceId);
    }

    public Device update(String deviceId, Device updated) {
        Device existing = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found: " + deviceId));
        existing.setName(updated.getName());
        existing.setStatus(updated.getStatus());
        existing.setType(updated.getType());
        existing.setLocation(updated.getLocation());
        return deviceRepository.save(existing);
    }

    @Transactional
    public void delete(String deviceId) {
        entityManager.createNativeQuery("DELETE FROM telemetry_data WHERE device_id = :deviceId")
                .setParameter("deviceId", deviceId)
                .executeUpdate();
        deviceRepository.deleteById(deviceId);
    }
}