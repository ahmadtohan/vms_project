/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.lcd.controller;

import com.top.lcd.annotations.NoPermissionApi;
import com.top.lcd.entity.Endpoint;
import com.top.lcd.helper.GenericProjection;
import com.top.lcd.repository.BaseRepository;
import com.top.lcd.repository.EndpointRepository;
import com.top.lcd.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Ahmad
 */
@RestController
@RequestMapping("/endpoint")
public class EndpointController extends BaseRepositoryController<Endpoint> {

    @Autowired
    EndpointRepository endpointRepository;

    @Autowired
    PermissionRepository permissionRepository;

    @Override
    public BaseRepository<Endpoint> getRepository() {
        return endpointRepository;
    }


    @NoPermissionApi
    @RequestMapping(value = "/endpoints", method = RequestMethod.GET)
    public ResponseEntity<?> endpoints()  {

        GenericProjection projection = new GenericProjection(new String[]{
                "id", "api"});
        return new ResponseEntity<>(projection.projectIterable(endpointRepository.findAll()), HttpStatus.OK);

    }


}
