/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.lcd.repository;

import com.top.lcd.entity.PickListItem;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Ahmad
 */

@Repository
public interface PickListItemRepository extends BaseRepository<PickListItem> {

    public PickListItem  findByName(String name);

    public PickListItem  findByCode(String code);

}
