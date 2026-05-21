package com.Team5.mqtt.controllers;

import com.Team5.mqtt.entity.Device;
import com.Team5.mqtt.services.DeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @PostMapping
    public ResponseEntity<?> addDevice(@RequestBody Device device) {
        List<String> errors = deviceService.validate(device);
        if (!errors.isEmpty()) {
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(deviceService.save(device), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Device>> getAll() {
        return ResponseEntity.ok(deviceService.getAll());
    }

    @GetMapping("/{deviceId}")
    public ResponseEntity<?> getById(@PathVariable String deviceId) {
        return deviceService.getById(deviceId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{deviceId}")
    public ResponseEntity<?> update(@PathVariable String deviceId, @RequestBody Device device) {
        return ResponseEntity.ok(deviceService.update(deviceId, device));
    }

    @DeleteMapping("/{deviceId}")
    public ResponseEntity<?> delete(@PathVariable String deviceId) {
        deviceService.delete(deviceId);
        return ResponseEntity.noContent().build();
    }
}