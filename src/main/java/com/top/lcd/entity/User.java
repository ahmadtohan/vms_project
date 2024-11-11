package com.top.lcd.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.top.lcd.annotations.AfterInsert;
import com.top.lcd.annotations.BeforeDelete;
import com.top.lcd.annotations.EntityJsonSerializer;
import com.top.lcd.configuration.Setup;
import com.top.lcd.helper.EnumEntity;
import com.top.lcd.helper.GenericSerializer;
import com.top.lcd.repository.UserRoleRepository;
import org.hibernate.validator.constraints.Email;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.*;
import java.util.*;

/**
 * @author Ahmad
 */
@Entity
public class User extends BaseEntity implements UserDetails {

    public enum Status implements EnumEntity {
        ACTIVE("Active"), INACTIVE("Inactive");

        private final String label;

        Status(String label) {
            this.label = label;
        }

        @Override
        public String getLabel() {
            return label;
        }
    }

    ;

    public enum Gender implements EnumEntity {
        MALE("Male"), FEMALE("Female");

        private final String label;

        Gender(String label) {
            this.label = label;
        }

        @Override
        public String getLabel() {
            return label;
        }
    }

    public enum Type implements EnumEntity {
        ADMIN("Admin"), NORMAL_USER("Normal User"), DOCTOR("Doctor"), PATIENT("Patient"), PHARMACIST("Pharmacist"), RECEPTIONIST("Receptionist"), CASHER("Casher");

        private final String label;

        Type(String label) {
            this.label = label;
        }

        @Override
        public String getLabel() {
            return label;
        }
    };

    public enum BloodType implements EnumEntity {
        A_POS("A+"), B_POS("B+"), AB_POS("AB+"), O_POS("O+"), A_NEG("A-"), B_NEG("B-"), AB_NEG("AB-"), O_NEG("O-");

        private final String label;

        BloodType(String label) {
            this.label = label;
        }

        @Override
        public String getLabel() {
            return label;
        }
    }

    @Column(unique = true, nullable = false)
    private String username;

    //password is only passed when deseralization is happening - input request
    @JsonProperty(access = Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Column
    @Email(message = "Email is not valid", regexp = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])")
    private String email;

    @Column
    private String mobileNumber;

    @Column
    private String eid;

    @Column
    private Date birthDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Type type = Type.NORMAL_USER;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column
    private Date lastLogin;

    @Transient
    private String token;

    @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Treatment> doctors;


    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Treatment> patients;


    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<UserRole> userRoles;


    @ManyToOne(fetch = FetchType.EAGER)
    @JsonSerialize(using = GenericSerializer.class)
    @EntityJsonSerializer(keys = {"id", "value"})
    private PickListItem nationality;

    @Column
    private Double weight;


    @Column
    private Double hight;


    @Column
    @Enumerated(EnumType.STRING)
    private BloodType bloodType = BloodType.AB_POS;


    @BeforeDelete
    void checkDelete() {
        if (this.username.equals("admin")) {
            throw new RuntimeException("User is admin");
        }

    }

    @AfterInsert
    void addRole() {
        final User user = this;

        if (user.type.equals(Type.ADMIN)) {

            this.userRoles = new ArrayList<>();
            return;
        }
        if (this.userRoles == null || this.userRoles.isEmpty()) {

            throw new RuntimeException("roles are empty");
        }
        for (UserRole roleObj : this.userRoles) {
            roleObj.setUser(this);
            Setup.getApplicationContext().getBean(UserRoleRepository.class).save(roleObj);
        }

    }

    public List<Treatment> getDoctors() {
        return doctors;
    }

    public void setDoctors(List<Treatment> doctors) {
        this.doctors = doctors;
    }

    public List<Treatment> getPatients() {
        return patients;
    }

    public void setPatients(List<Treatment> patients) {
        this.patients = patients;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        password = Setup.getApplicationContext().getBean(PasswordEncoder.class).encode(password);
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

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

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public List<UserRole> getUserRoles() {
        return userRoles;
    }

    public void setUserRoles(List<UserRole> userRoles) {
        this.userRoles = userRoles;
    }

    public PickListItem getNationality() {
        return nationality;
    }

    public void setNationality(PickListItem nationality) {
        this.nationality = nationality;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getHight() {
        return hight;
    }

    public void setHight(Double hight) {
        this.hight = hight;
    }

    public BloodType getBloodType() {
        return bloodType;
    }

    public void setBloodType(BloodType bloodType) {
        this.bloodType = bloodType;
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Set<GrantedAuthority> authorities = new HashSet<>();

        for (UserRole r : userRoles) {
            authorities.add(new GrantedAuthority() {
                @Override
                public String getAuthority() {
                    return r.getRole().getName();
                }

                @Override
                public String toString() {
                    return r.getRole().getName();
                }

            });

        }

        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status.equals(Status.ACTIVE);
    }



}
