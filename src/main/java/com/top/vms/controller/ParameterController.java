/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.controller;

import com.top.vms.entity.Parameter;
import com.top.vms.repository.BaseRepository;
import com.top.vms.repository.ParameterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Ahmad
 */
@RestController
@RequestMapping("/parameter")
public class ParameterController extends BaseVmsRepositoryController<Parameter> {

    @Autowired
    ParameterRepository parameterRepository;

    @Override
    public BaseRepository<Parameter> getRepository() {
        return parameterRepository;
    }


}
