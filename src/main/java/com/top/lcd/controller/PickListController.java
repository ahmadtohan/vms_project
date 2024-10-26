/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.lcd.controller;

import com.top.lcd.annotations.NoPermissionApi;
import com.top.lcd.entity.PickList ;
import com.top.lcd.repository.BaseRepository;
import com.top.lcd.repository.PickListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @NoPermissionApi
    @RequestMapping(value = "/getbycode", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> getByCode(@RequestParam(required = true) String code) {

        return new ResponseEntity<>(pickListRepository.findByCode(code), HttpStatus.OK);
    }
}
