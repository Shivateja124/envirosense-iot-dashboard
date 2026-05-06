package com.Team5.mqtt.repositories;

import com.Team5.mqtt.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, String> {
    List<Device> findByStatus(String status);
    List<Device> findByType(String type);
}