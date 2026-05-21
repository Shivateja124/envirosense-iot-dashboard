package com.Team5.mqtt.entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "devices")
public class Device {

    @Id
    private String deviceId;

    private String name;
    private String status;
    private String type;
    private String location;
    private String registeredAt;

    @OneToMany(mappedBy = "device",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<TelemetryData> telemetryDataList;


    public Device() {}

    public Device(String deviceId, String name, String status, String type, String location) {
        this.deviceId = deviceId;
        this.name = name;
        this.status = status;
        this.type = type;
        this.location = location;
    }


    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(String registeredAt) { this.registeredAt = registeredAt; }

    public List<TelemetryData> getTelemetryDataList() { return telemetryDataList; }
    public void setTelemetryDataList(List<TelemetryData> telemetryDataList) { this.telemetryDataList = telemetryDataList; }
}