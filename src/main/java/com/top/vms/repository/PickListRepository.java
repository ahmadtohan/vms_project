/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.repository;

import com.top.vms.entity.PickList;
import com.top.vms.entity.PickListItem;
import com.top.vms.entity.Role;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Ahmad
 */

@Repository
public interface PickListRepository extends BaseRepository<PickList> {

    public PickList findByName(String name);

    public PickList  findByCode(String code);

}
