/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.lcd.controller;

import com.google.zxing.NotFoundException;
import com.google.zxing.WriterException;
import com.top.lcd.configuration.Setup;
import com.top.lcd.entity.Attachment;
import com.top.lcd.entity.Parameter;
import com.top.lcd.entity.Visitor;
import com.top.lcd.helper.EmailService;
import com.top.lcd.helper.QRGenerator;
import com.top.lcd.helper.Utils;
import com.top.lcd.repository.AttachmentRepository;
import com.top.lcd.repository.BaseRepository;
import com.top.lcd.repository.ParameterRepository;
import com.top.lcd.repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import org.joda.time.DateTime;

/**
 * @author Ahmad
 */
@RestController
@RequestMapping("/visitor")
public class VisitorController extends BaseRepositoryController<Visitor> {

    @Autowired
    VisitorRepository visitorRepository;

    @Autowired
    AttachmentRepository attachmentRepository;

    @Autowired
    ParameterRepository parameterRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public BaseRepository<Visitor> getRepository() {
        return visitorRepository;
    }

    @Override
    protected ResponseEntity<?> createEntity(Visitor entity) {
        String accessKey = Utils.genrateShortAccessKey();
        while (true) {
            Visitor visitor = visitorRepository.findByAccessKey(accessKey);
            if (visitor == null) {
                break;
            }
            accessKey = Utils.genrateShortAccessKey();
        }
        entity.setStatus(Visitor.Status.PENDING);
        entity.setAccessKey(accessKey);
        entity = visitorRepository.save(entity);
        Parameter visitorParameterUrl = parameterRepository.findByCode(Setup.BASE_VERIFY_VISITOR_URL_PARAMETER_CODE);
        String url = visitorParameterUrl.getValue() + "?accessKey=" + accessKey;
        try {
            Attachment attachment = QRGenerator.createQRAsAttachment(url, entity.getId(), entity.getClass().getSimpleName());
            emailService.sendMailWithInlineResources(entity.getEmail(), "VMS Request", "Hello dear<br><br>your request is pending.... <br> when admin approve!, you can access by this QR: <br>", attachment.getPath());
        } catch (WriterException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(entity);
    }

    @Override
    protected ResponseEntity<?> updateEntity(Visitor entity) {
        if(entity.getStatus()!=null){
            emailService.sendMail(entity.getEmail(), "Re: VMS Request", "Hello dear, your request has been "+entity.getStatus().getLabel());
        }
        visitorRepository.save(entity);
        return new ResponseEntity<>(new Response("Updated"), HttpStatus.OK);
    }

    @RequestMapping(value = "/verify/{accessKey}", method = RequestMethod.GET)
    public ResponseEntity<?> verify(HttpServletRequest request, HttpServletResponse response,
                                      @PathVariable("accessKey") String accessKey) throws IOException, NotFoundException {
        Visitor visitor = visitorRepository.findByAccessKey(accessKey);

        if (visitor != null) {
            if (!visitor.getStatus().equals(Visitor.Status.APPROVED)) {
                return new ResponseEntity<>(new Response("Not Approved"), HttpStatus.BAD_REQUEST);

            }
            if(new DateTime(visitor.getFromDate()).minusHours(3).isBeforeNow() && new DateTime(visitor.getToDate()).plusHours(3).isAfterNow()) {
                Attachment attachment = attachmentRepository.findByEntityIdAndEntityTypeAndType(visitor.getId(), visitor.getClass().getSimpleName(), "QR");
                if (attachment != null) {

                    String url = QRGenerator.readQR(attachment.getPath());
                    if (url != null && url.endsWith(accessKey)) {
                        //visitor.setAttachments(new ArrayList<Attachment>(){{add(attachment);}});
                        return ResponseEntity.ok(visitor);
                    }
                }
            }else{
                return new ResponseEntity<>(new Response("Date and Time Expired "), HttpStatus.BAD_REQUEST);

            }
        }
        return notFoundResponse();
    }

}
