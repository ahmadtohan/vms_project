package com.top.vms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;

/**
 * @author Ahmad Tohan
 */

@Entity
public class PickList extends BaseEntity{
    
    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String value;

    @Column
    private String description;

    @OneToMany(mappedBy = "pickList", fetch = FetchType.LAZY)
    private List<PickListItem> pickListItems;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<PickListItem> getPickListItems() {
        return pickListItems;
    }

    public void setPickListItems(List<PickListItem> pickListItems) {
        this.pickListItems = pickListItems;
    }
}
