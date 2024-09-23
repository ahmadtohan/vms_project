/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.lcd.controller;

import com.top.lcd.entity.PickList ;
import com.top.lcd.repository.BaseRepository;
import com.top.lcd.repository.PickListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Ahmad
 */
@RestController
@RequestMapping("/picklist")
public class PickListController extends BaseRepositoryController<PickList> {

    @Autowired
    PickListRepository pickListRepository;

    @Override
    public BaseRepository<PickList > getRepository() {
        return pickListRepository;
    }


}
