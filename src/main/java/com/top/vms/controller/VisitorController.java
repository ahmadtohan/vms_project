/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.controller;

import com.top.vms.entity.Visitor;
import com.top.vms.repository.BaseRepository;
import com.top.vms.repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Ahmad
 */
@RestController
@RequestMapping("/visitor")
public class VisitorController extends BaseRepositoryController<Visitor> {

    @Autowired
    VisitorRepository visitorRepository;

    @Override
    public BaseRepository<Visitor> getRepository() {
        return visitorRepository;
    }


}
