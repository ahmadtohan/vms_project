package com.top.vms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.top.vms.annotations.AfterInsert;
import com.top.vms.annotations.BeforeInsert;
import com.top.vms.annotations.EntityJsonSerializer;
import com.top.vms.configuration.Setup;
import com.top.vms.helper.EnumEntity;

import java.util.Date;
import java.util.List;
import javax.persistence.*;

import com.top.vms.helper.GenericSerializer;
import com.top.vms.repository.RoleRepository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.validator.constraints.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

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
        ADMIN("Admin"), NORMAL("Normal");

        private final String label;

        Type(String label) {
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
    private Type type = Type.NORMAL;

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


    @ManyToOne(fetch = FetchType.LAZY)
    @JsonSerialize(using = GenericSerializer.class)
    @EntityJsonSerializer(keys = {"id", "name"})
    private Department department;

    @ManyToMany(mappedBy = "users", fetch = FetchType.EAGER)
    @JsonProperty(access = Access.WRITE_ONLY)
    private List<Role> roles;

    @BeforeInsert
    void addRole() {
        final User user = this;

        if(user.type.equals(Type.ADMIN)){

            this.roles=new ArrayList<>();
            return;
        }
        if (this.roles==null || this.roles.isEmpty()){

            throw  new RuntimeException("roles are empty");
        }
        List<Role> newRoles = new ArrayList<>();
        for (Role roleObj : this.roles) {
            Role role = Setup.getApplicationContext().getBean(RoleRepository.class).findOne(roleObj.getId());
            role.setUsers(new ArrayList<User>() {
                {
                    add(user);
                }
            });
            newRoles.add(role);
        }
        this.setRoles(newRoles);
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

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Set<GrantedAuthority> authorities = new HashSet<>();

        for (Role r : roles) {
            authorities.add(new GrantedAuthority() {
                @Override
                public String getAuthority() {
                    return r.getName();
                }

                @Override
                public String toString() {
                    return r.getName();
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
