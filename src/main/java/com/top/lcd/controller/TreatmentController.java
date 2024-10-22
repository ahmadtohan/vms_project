/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.lcd.controller;

import com.top.lcd.annotations.NoPermissionApi;
import com.top.lcd.configuration.Setup;
import com.top.lcd.entity.Treatment;
import com.top.lcd.helper.SelectQuery;
import com.top.lcd.repository.BaseRepository;
import com.top.lcd.repository.TreatmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
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

    @NoPermissionApi
    @RequestMapping(value = "/patienttreatmentlistPage", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> getLoggedUserTreatments(Pageable pageable) {
        SelectQuery<Object> query = new SelectQuery(Treatment.class);
        query.filterBy("patient.id", "=", Setup.getCurrentUserInfo().getUser().getId());
        return new ResponseEntity<>(query.execute(pageable), HttpStatus.OK);
    }

    @NoPermissionApi
    @RequestMapping(value = "/getpatienttreatment/{id}",
            method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> getPatientTreatment(@PathVariable("id") Long id) {
        return new ResponseEntity<>(treatmentRepository.findOneByIdAndPatientId(id, Setup.getCurrentUserInfo().getUser().getId()), HttpStatus.OK);

    }

    @NoPermissionApi
    @RequestMapping(value = "/addpatienttreatment", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> addPatientTreatment(@RequestBody Treatment treatment) {
        treatment.setStatus(Treatment.Status.PENDING);
        treatment.setPatient(Setup.getCurrentUserInfo().getUser());
        return super.createEntity(treatment);
    }

}
