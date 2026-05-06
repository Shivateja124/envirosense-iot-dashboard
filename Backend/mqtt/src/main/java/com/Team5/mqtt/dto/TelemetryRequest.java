package com.Team5.mqtt.dto;

import java.time.LocalDateTime;

public class TelemetryRequest {

    private String metric;
    private Double value;
    private LocalDateTime timestamp;
    private String deviceId;

    public TelemetryRequest() {}

    public String getMetric() { return metric; }
    public void setMetric(String metric) { this.metric = metric; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
}