package com.Team5.mqtt.repositories;

import com.Team5.mqtt.entity.TelemetryData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TelemetryRepository extends JpaRepository<TelemetryData, Long> {

    List<TelemetryData> findByDeviceDeviceId(String deviceId);
    List<TelemetryData> findByMetric(String metric);
    List<TelemetryData> findByMetricAndDeviceLocationAndDeviceStatus(
            String metric, String location, String status
    );
}