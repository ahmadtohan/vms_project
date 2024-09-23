package com.top.lcd.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import java.util.List;

/**
 * @author Ahmad Tohan
 */

@Entity
public class Department  extends BaseEntity{
    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column
    private String location;

    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    private List<User> users;

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
