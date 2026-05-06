package com.Team5.mqtt.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "telemetry_data")
public class TelemetryData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String metric;
    private Double value;
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    public TelemetryData() {}

    public TelemetryData(Long id, String metric, Double value, LocalDateTime timestamp, Device device) {
        this.id = id;
        this.metric = metric;
        this.value = value;
        this.timestamp = timestamp;
        this.device = device;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMetric() { return metric; }
    public void setMetric(String metric) { this.metric = metric; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Device getDevice() { return device; }
    public void setDevice(Device device) { this.device = device; }
}