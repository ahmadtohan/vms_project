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
public class PickList extends BaseEntity{

    public PickList(String code, String name,String description, List<PickListItem> pickListItems) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.pickListItems = pickListItems;
    }

    public PickList() {

    }

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @OneToMany(mappedBy = "pickList", fetch = FetchType.EAGER)
    @JsonSerialize(using = GenericSerializer.class)
    @EntityJsonSerializer(keys = {"id","value"})
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
