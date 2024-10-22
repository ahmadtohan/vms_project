package com.top.lcd.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.top.lcd.annotations.EntityJsonSerializer;
import com.top.lcd.helper.EnumEntity;
import com.top.lcd.helper.GenericSerializer;

import javax.persistence.*;
import java.util.Date;

/**
 * @author Ahmad Tohan
 */

@Entity
public class Treatment extends BaseEntity{

    public enum Type implements EnumEntity {
        LIVER_CANCER_DETECTION("Liver Cancer Detection"), SCAN("Scan"), OTHER("Other");

        private final String label;

        Type(String label) {
            this.label = label;
        }

        @Override
        public String getLabel() {
            return label;
        }
    }

    public enum Status implements EnumEntity {
        PENDING("Pending"), CANCELLED("Cancelled"), DONE("Done");

        private final String label;

        Status(String label) {
            this.label = label;
        }

        @Override
        public String getLabel() {
            return label;
        }
    };

    @Column
    private String description;

    @Column(nullable = false)
    private Date appointmentDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Type type = Type.LIVER_CANCER_DETECTION;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonSerialize(using = GenericSerializer.class)
    @EntityJsonSerializer(keys = {"id", "fullName"})
    private User doctor;


    @ManyToOne(fetch = FetchType.EAGER)
    @JsonSerialize(using = GenericSerializer.class)
    @EntityJsonSerializer(keys = {"id", "fullName"})
    private User patient;

    public Date getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(Date appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public User getDoctor() {
        return doctor;
    }

    public void setDoctor(User doctor) {
        this.doctor = doctor;
    }

    public User getPatient() {
        return patient;
    }

    public void setPatient(User patient) {
        this.patient = patient;
    }
}
