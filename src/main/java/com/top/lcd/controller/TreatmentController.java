/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.lcd.controller;

import com.top.lcd.annotations.NoPermissionApi;
import com.top.lcd.configuration.Setup;
import com.top.lcd.entity.Treatment;
import com.top.lcd.helper.EmailService;
import com.top.lcd.helper.SelectQuery;
import com.top.lcd.repository.BaseRepository;
import com.top.lcd.repository.TreatmentRepository;
import com.top.lcd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

/**
 * @author Ahmad
 */
@RestController
@RequestMapping("/treatment")
public class TreatmentController extends BaseRepositoryController<Treatment> {

    @Autowired
    TreatmentRepository treatmentRepository;

    @Autowired
    EmailService emailService;

    @Override
    public BaseRepository<Treatment> getRepository() {
        return treatmentRepository;
    }

    @NoPermissionApi
    @RequestMapping(value = "/patienttreatmentlistPage", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> getLoggedPatientUserTreatments(Pageable pageable, @RequestParam(required = false) Treatment.Status status) {
        SelectQuery<Object> query = new SelectQuery(Treatment.class);
        query.filterBy("patient.id", "=", Setup.getCurrentUserInfo().getUser().getId());
        if (status != null) {
            query.filterBy("status", "=", status);
        }
        return new ResponseEntity<>(query.execute(pageable), HttpStatus.OK);
    }


    @NoPermissionApi
    @RequestMapping(value = "/doctortreatmentlistPage", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> getLoggedDoctorUserTreatments(Pageable pageable, @RequestParam(required = false) Treatment.Status status) {
        SelectQuery<Object> query = new SelectQuery(Treatment.class);
        query.filterBy("doctor.id", "=", Setup.getCurrentUserInfo().getUser().getId());
        if (status != null) {
            query.filterBy("status", "=", status);
        }
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
    @RequestMapping(value = "/getdoctorpatienttreatment/{id}",
            method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> getDoctorPatientTreatment(@PathVariable("id") Long id) {
        return new ResponseEntity<>(treatmentRepository.findOneByIdAndDoctorId(id, Setup.getCurrentUserInfo().getUser().getId()), HttpStatus.OK);

    }

    @NoPermissionApi
    @RequestMapping(value = "/addpatienttreatment", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> addPatientTreatment(@RequestBody Treatment treatment) {
        treatment.setStatus(Treatment.Status.PENDING);
        treatment.setPatient(Setup.getCurrentUserInfo().getUser());
        treatment = treatmentRepository.save(treatment);

        DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        String body = "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "  <meta charset=\"UTF-8\">\n" +
                "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "  <title>Appointment Details</title>\n" +
                "  <style>\n" +
                "    body, table, td, a {\n" +
                "      margin: 0;\n" +
                "      padding: 0;\n" +
                "      text-size-adjust: 100%;\n" +
                "      font-family: Arial, sans-serif;\n" +
                "    }\n" +
                "    table {\n" +
                "      border-spacing: 0;\n" +
                "    }\n" +
                "    img {\n" +
                "      border: 0;\n" +
                "      display: block;\n" +
                "      height: auto;\n" +
                "    }\n" +
                "    .email-wrapper {\n" +
                "      width: 100%;\n" +
                "      background-color: #f9f9f9;\n" +
                "      padding: 20px;\n" +
                "    }\n" +
                "    .email-content {\n" +
                "      max-width: 600px;\n" +
                "      margin: 0 auto;\n" +
                "      background-color: #ffffff;\n" +
                "      padding: 25px;\n" +
                "      border-radius: 8px;\n" +
                "      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n" +
                "    }\n" +
                "    .header {\n" +
                "      text-align: center;\n" +
                "      color: #333;\n" +
                "    }\n" +
                "    h1 {\n" +
                "      font-size: 24px;\n" +
                "      color: #1a73e8;\n" +
                "    }\n" +
                "    .appointment-details {\n" +
                "      margin: 20px 0;\n" +
                "    }\n" +
                "    .appointment-details p {\n" +
                "      font-size: 16px;\n" +
                "      color: #555;\n" +
                "      margin: 5px 0;\n" +
                "    }\n" +
                "    .appointment-details .label {\n" +
                "      font-weight: bold;\n" +
                "      color: #333;\n" +
                "    }\n" +
                "    .appointment-button {\n" +
                "      display: inline-block;\n" +
                "      background-color: #1a73e8;\n" +
                "      color: white;\n" +
                "      padding: 12px 24px;\n" +
                "      font-size: 16px;\n" +
                "      text-decoration: none;\n" +
                "      border-radius: 5px;\n" +
                "      margin-top: 20px;\n" +
                "    }\n" +
                "    .footer {\n" +
                "      text-align: center;\n" +
                "      color: #888;\n" +
                "      font-size: 12px;\n" +
                "      margin-top: 25px;\n" +
                "    }\n" +
                "    .footer a {\n" +
                "      color: #1a73e8;\n" +
                "      text-decoration: none;\n" +
                "    }\n" +
                "  </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "  <div class=\"email-wrapper\">\n" +
                "    <table role=\"presentation\" class=\"email-content\">\n" +
                "      <tr>\n" +
                "        <td>\n" +
                "          <!-- Header -->\n" +
                "          <div class=\"header\">\n" +
                "            <h1>Appointment Info</h1>\n" +
                "            <p>Thank you for booking with us!</p>\n" +
                "          </div>\n" +
                "\n" +
                "          <!-- Appointment Details -->\n" +
                "          <div class=\"appointment-details\">\n" +
                "            <p><span class=\"label\">Name:</span> " + treatment.getPatient().getFullName() + "</p>\n" +
                "            <p><span class=\"label\">Appointment Date:" + df.format(treatment.getAppointmentDate()) + "</p>\n" +
                "            <p><span class=\"label\">Doctor:</span> " + Setup.getApplicationContext().getBean(UserRepository.class).findOne(treatment.getDoctor().getId()).getFullName() + "</p>\n" +
                "            <p><span class=\"label\">Treatment Type:</span> " + treatment.getType().getLabel() + "</p>\n" +
                "          </div>\n" +
                "         <p>Click the button below to view more details:</p>\n" +
                "          <a href=\"http://localhost:3000/lcd/app/viewPatientTreatment?id=" + treatment.getId() + "\" class=\"appointment-button\">View</a>" +
                "        </td>\n" +
                "      </tr>\n" +
                "    </table>\n" +
                "  </div>\n" +
                "</body>\n" +
                "</html>\n";
        emailService.sendMail(Setup.getCurrentUserInfo().getUser().getEmail(), "Appointment Request", body
        );
        return new ResponseEntity<>(treatment, HttpStatus.OK);
    }

    @NoPermissionApi
    @RequestMapping(value = "/adddoctorpatienttreatment", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> addDoctorPatientTreatment(@RequestBody Treatment treatment) {
        treatment.setStatus(Treatment.Status.PENDING);
        treatment.setDoctor(Setup.getCurrentUserInfo().getUser());
        return super.createEntity(treatment);
    }

    @NoPermissionApi
    @RequestMapping(value = "/changetreatmentstatus/{id}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> changeTreatmentStatus(@PathVariable("id") Long id, @RequestParam(required = true) Treatment.Status status) {
        Treatment treatment = treatmentRepository.findOne(id);
        treatment.setStatus(status);
        treatmentRepository.save(treatment);
        return okResponse();
    }

}
