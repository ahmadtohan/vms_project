/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.controller;

import com.top.vms.entity.Role;
import com.top.vms.repository.RoleRepository;
import com.top.vms.repository.BaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Ahmad
 */
@RestController
@RequestMapping("/role")
public class RoleController extends BaseVmsRepositoryController<Role> {

    @Autowired
    RoleRepository roleRepository;

    @Override
    public BaseRepository<Role> getRepository() {
        return roleRepository;
    }


}
