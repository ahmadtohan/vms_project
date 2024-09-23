package com.top.lcd.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.top.lcd.annotations.EntityJsonSerializer;
import com.top.lcd.helper.GenericSerializer;

import javax.persistence.*;

/**
 * @author Ahmad Tohan
 */

@Entity
public class Permission extends BaseEntity{


    @ManyToOne(fetch = FetchType.LAZY)
    @JsonSerialize(using = GenericSerializer.class)
    @EntityJsonSerializer(keys = {"id", "api"})
    private Endpoint endpoint;


    @ManyToOne(fetch = FetchType.LAZY)
    @JsonSerialize(using = GenericSerializer.class)
    @EntityJsonSerializer(keys = {"id", "name"})
    private Role role;

    public Endpoint getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(Endpoint endpoint) {
        this.endpoint = endpoint;
    }


    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
