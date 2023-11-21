package com.top.vms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.top.vms.helper.EnumEntity;
import org.hibernate.validator.constraints.Email;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 *
 * @author Ahmad
 */
@Entity
public class Visitor extends BaseEntity {

    public enum Status implements EnumEntity {
        PENDING("Pending"), APPROVED("Approved"), CANCELLED("Cancelled");

        private final String label;

        Status(String label) {
            this.label = label;
        }

        @Override
        public String getLabel() {
            return label;
        }
    };

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    @Email(message = "Email is not valid", regexp = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])")
    private String email;

    @Column
    private String mobileNumber;

    @Column
    private String eid;

    @Column
    private Integer age;

    @Column
    private String reasonForVisit;

    @Column
    private String nameOfVisitedPerson;

    @Column
    private String numberOfVisitedPerson;

    @Column
    private Date fromDate;

    @Column
    private Date toDate;

    @Column
    private Date approvalDate;

    @Column
    @Enumerated(EnumType.STRING)
    private Status status=Status.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    private User approvalUser;

    @ManyToOne(fetch = FetchType.LAZY)
    private Department department;

    @Column(unique = true)
    private String accessKey;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getEid() {
        return eid;
    }

    public void setEid(String eid) {
        this.eid = eid;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getReasonForVisit() {
        return reasonForVisit;
    }

    public void setReasonForVisit(String reasonForVisit) {
        this.reasonForVisit = reasonForVisit;
    }

    public String getNameOfVisitedPerson() {
        return nameOfVisitedPerson;
    }

    public void setNameOfVisitedPerson(String nameOfVisitedPerson) {
        this.nameOfVisitedPerson = nameOfVisitedPerson;
    }

    public String getNumberOfVisitedPerson() {
        return numberOfVisitedPerson;
    }

    public void setNumberOfVisitedPerson(String numberOfVisitedPerson) {
        this.numberOfVisitedPerson = numberOfVisitedPerson;
    }

    public Date getFromDate() {
        return fromDate;
    }

    public void setFromDate(Date fromDate) {
        this.fromDate = fromDate;
    }

    public Date getToDate() {
        return toDate;
    }

    public void setToDate(Date toDate) {
        this.toDate = toDate;
    }

    public Date getApprovalDate() {
        return approvalDate;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setApprovalDate(Date approvalDate) {
        this.approvalDate = approvalDate;
    }

    public User getApprovalUser() {
        return approvalUser;
    }

    public void setApprovalUser(User approvalUser) {
        this.approvalUser = approvalUser;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }
}
