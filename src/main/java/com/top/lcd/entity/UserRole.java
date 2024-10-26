package com.top.lcd.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.top.lcd.annotations.EntityJsonSerializer;
import com.top.lcd.helper.GenericSerializer;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;

/**
 * @author Ahmad
 */
@Entity
public class UserRole extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonSerialize(using = GenericSerializer.class)
    @EntityJsonSerializer(keys = {"id", "fullName"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonSerialize(using = GenericSerializer.class)
    @EntityJsonSerializer(keys = {"id", "name"})
    private Role role;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
