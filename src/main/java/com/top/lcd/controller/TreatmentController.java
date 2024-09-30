/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.lcd.controller;

import com.top.lcd.entity.Department;
import com.top.lcd.entity.Treatment;
import com.top.lcd.repository.BaseRepository;
import com.top.lcd.repository.DepartmentRepository;
import com.top.lcd.repository.TreatmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Ahmad
 */
@RestController
@RequestMapping("/treatment")
public class TreatmentController extends BaseRepositoryController<Treatment> {

    @Autowired
    TreatmentRepository treatmentRepository;

    @Override
    public BaseRepository<Treatment> getRepository() {
        return treatmentRepository;
    }
    

}
