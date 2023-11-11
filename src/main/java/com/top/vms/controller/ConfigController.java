/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.controller;

import com.top.vms.entity.Config;
import com.top.vms.repository.BaseRepository;
import com.top.vms.repository.ConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Ahmad
 */
@RestController
@RequestMapping("/config")
public class ConfigController extends BaseVmsRepositoryController<Config> {

    @Autowired
    ConfigRepository configRepository;

    @Override
    public BaseRepository<Config> getRepository() {
        return configRepository;
    }


}
