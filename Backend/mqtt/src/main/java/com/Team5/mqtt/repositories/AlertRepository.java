package com.Team5.mqtt.repositories;

import com.Team5.mqtt.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {

}