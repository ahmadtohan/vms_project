package com.top.lcd.entity;

import com.top.lcd.annotations.AfterDelete;
import com.top.lcd.annotations.AfterInsert;
import com.top.lcd.annotations.AfterUpdate;
import com.top.lcd.configuration.Setup;

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
    private Boolean hasPermission = Boolean.TRUE ;

    @Column
    private String description;

    @OneToMany(mappedBy = "endpoint", fetch = FetchType.LAZY)
    private List<Permission> permissions;

    @AfterInsert
    @AfterUpdate
    @AfterDelete
    public void updateEndpointsInMemory() {
        Setup.setNoPermissionEndpointList();
    }

    public String getApi() {
        return api;
    }

    public void setApi(String api) {
        this.api = api;
    }

    public Boolean getHasPermission() {
        return hasPermission;
    }

    public void setHasPermission(Boolean hasPermission) {
        this.hasPermission = hasPermission;
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
