/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.helper;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 *
 * @author ahmad
 */
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public interface EnumEntity {

	public String name();

	public String getLabel();

	default public String getValue() {
		return this.name();
	}
}