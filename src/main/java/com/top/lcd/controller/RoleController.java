/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.lcd.controller;

import com.top.lcd.annotations.NoPermissionApi;
import com.top.lcd.entity.Role;
import com.top.lcd.helper.GenericProjection;
import com.top.lcd.repository.PermissionRepository;
import com.top.lcd.repository.RoleRepository;
import com.top.lcd.repository.BaseRepository;
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
@RequestMapping("/role")
public class RoleController extends BaseRepositoryController<Role> {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PermissionRepository permissionRepository;

    @Override
    public BaseRepository<Role> getRepository() {
        return roleRepository;
    }

    @Override
    protected ResponseEntity<?> getEntity(Long id) {
        Role role = roleRepository.findOne(id);
        role.setPermissions(permissionRepository.findByRoleIn(new ArrayList<Role>() {{
            add(role);
        }}));

        GenericProjection projection = new GenericProjection(new String[]{
                "id", "name", "status", "description", "{name:'permissions', keys : {'id', {name:'endpoint',keys:{'id','api'}}}}"});
        return new ResponseEntity<>(projection.project(role), HttpStatus.OK);
    }

    @NoPermissionApi
    @RequestMapping(value = "/activeroles", method = RequestMethod.GET)
    public ResponseEntity<?> activeRoles()  {

        GenericProjection projection = new GenericProjection(new String[]{
                "id", "name"});
        return new ResponseEntity<>(projection.projectIterable(roleRepository.findByStatus(Role.Status.ACTIVE)), HttpStatus.OK);

    }


}
