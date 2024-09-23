/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.lcd.controller;

import com.top.lcd.entity.Endpoint;
import com.top.lcd.entity.Permission;
import com.top.lcd.repository.BaseRepository;
import com.top.lcd.repository.EndpointRepository;
import com.top.lcd.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Ahmad
 */
@RestController
@RequestMapping("/permission")
public class PermissionController extends BaseRepositoryController<Permission> {

    @Autowired
    EndpointRepository endpointRepository;

    @Autowired
    PermissionRepository permissionRepository;

    @Override
    public BaseRepository<Permission> getRepository() {
        return permissionRepository;
    }


    @RequestMapping(value = "/permissionlist", method = RequestMethod.GET)
    public ResponseEntity<?> permissionMap() {
        List<Map<String, Object>> result = new ArrayList<>();

        List<Endpoint> endpoints = endpointRepository.findAll();
        endpoints.sort((o1, o2) -> o1.getApi().compareTo(o2.getApi()));
        for (Endpoint endpoint : endpoints) {
            List<Permission> permissions = permissionRepository.findByEndpoint(endpoint);

            List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
            for (Permission permission : permissions) {
                Map<String, Object> roleMap = new HashMap<String, Object>() {{
                    put("id", permission.getRole().getId());
                    put("name", permission.getRole().getName());
                }};
                list.add(roleMap);
            }
            Map<String, Object> resultMap = new HashMap<>();
            resultMap. put("api", endpoint.getApi());
            resultMap. put("hasPermission", endpoint.getHasPermission());
            resultMap. put("roles", list);
            result.add(resultMap);
        }

        return new ResponseEntity<>(result, HttpStatus.OK);

    }


}
