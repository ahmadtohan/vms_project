/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.controller;

import com.top.vms.annotations.NoPermissionApi;
import com.top.vms.entity.Endpoint;
import com.top.vms.entity.Role;
import com.top.vms.helper.GenericProjection;
import com.top.vms.repository.BaseRepository;
import com.top.vms.repository.EndpointRepository;
import com.top.vms.repository.PermissionRepository;
import com.top.vms.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

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
