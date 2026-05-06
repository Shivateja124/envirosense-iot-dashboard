package com.Team5.mqtt.services;

import com.Team5.mqtt.entity.Alert;
import com.Team5.mqtt.entity.TelemetryData;
import com.Team5.mqtt.repositories.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    public void checkAndCreateAlert(TelemetryData data) {

        double value = data.getValue();
        String metric = data.getMetric();

        List<Alert> alerts = new ArrayList<>();

        if ("co2_level".equals(metric) && value > 1000) {
            alerts.add(new Alert(
                    data.getDevice().getDeviceId(),
                    metric,
                    "CO2 level is " + value + " ppm (HIGH)",
                    "HIGH",
                    LocalDateTime.now()
            ));
        }

        if ("light_intensity".equals(metric) && value < 300) {
            alerts.add(new Alert(
                    data.getDevice().getDeviceId(),
                    metric,
                    "Light intensity is " + value + " lux (LOW)",
                    "LOW",
                    LocalDateTime.now()
            ));
        }

        if ("humidity".equals(metric) && value < 30) {
            alerts.add(new Alert(
                    data.getDevice().getDeviceId(),
                    metric,
                    "Humidity is " + value + "% (LOW)",
                    "LOW",
                    LocalDateTime.now()
            ));
        }


        if ("temperature".equals(metric) && value > 35) {
            alerts.add(new Alert(
                    data.getDevice().getDeviceId(),
                    metric,
                    "Temperature is " + value + "°C (HIGH)",
                    "HIGH",
                    LocalDateTime.now()
            ));
        }

        if (!alerts.isEmpty()) {
            alertRepository.saveAll(alerts);
        }
    }

    public List<Alert> findAll() {
        return alertRepository.findAll();
    }
}