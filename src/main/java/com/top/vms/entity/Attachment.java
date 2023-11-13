/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.Column;
import javax.persistence.Entity;

/**
 *
 * @author Ahmad Tohan <ahmad.tohan92@gmail.com>
 */
@Entity
public class Attachment extends BaseEntity {

    @Column
    private String type;

    @Column(unique = true)
    private String name;

    private String path;

    @JsonIgnore
    @Column
    private Long entityId;

    @JsonIgnore
    @Column
    private String entityType;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }
   
    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

}
