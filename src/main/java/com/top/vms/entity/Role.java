package com.top.vms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.top.vms.annotations.AfterInsert;
import com.top.vms.configuration.Setup;
import com.top.vms.helper.EnumEntity;
import com.top.vms.repository.PermissionRepository;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Ahmad Tohan
 */

@Entity
public class Role extends BaseEntity{

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
    };

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role.Status status = Role.Status.ACTIVE;

    @Column(unique = true, nullable = false)
    private String name;

    @Column
    private String description;

    @ManyToMany
    @JsonIgnore
    private List<User> users;

    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private List<Permission> permissions;

    @AfterInsert
    void insertPermissions(){
        for (Permission permission: permissions) {
            permission.setRole(this);
            Setup.getApplicationContext().getBean(PermissionRepository.class).save(permission);
        }

    }

    public Role.Status getStatus() {
        return status;
    }

    public void setStatus(Role.Status status) {
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public List<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }
}
