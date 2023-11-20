package com.top.vms.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.top.vms.annotations.EntityJsonSerializer;
import com.top.vms.helper.GenericSerializer;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;

/**
 * @author Ahmad Tohan
 */

@Entity
public class PickListItem extends BaseEntity{
    
    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String value;

    @Column
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    private PickList pickList;

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

    public PickList getPickList() {
        return pickList;
    }

    public void setPickList(PickList pickList) {
        this.pickList = pickList;
    }

}
