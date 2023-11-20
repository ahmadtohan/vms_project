package com.top.vms.entity;

import javax.persistence.Column;
import javax.persistence.Entity;

/**
 * @author Ahmad Tohan
 */

@Entity
public class Parameter extends BaseEntity{

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String value;

    public Parameter() {
    }

    public Parameter(String code, String name, String value) {
        this.code = code;
        this.name = name;
        this.value = value;
    }

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
}
