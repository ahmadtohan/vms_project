package com.top.vms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.top.vms.annotations.EntityJsonSerializer;
import com.top.vms.helper.GenericSerializer;

import javax.persistence.*;
import java.util.List;

/**
 * @author Ahmad Tohan
 */

@Entity
public class Endpoint extends BaseEntity{
    
    @Column(unique = true, nullable = false)
    private String api;

    @Column
    private String description;

    @OneToMany(mappedBy = "endpoint", fetch = FetchType.LAZY)
    private List<Permission> permissions;

    public String getApi() {
        return api;
    }

    public void setApi(String api) {
        this.api = api;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }
}
