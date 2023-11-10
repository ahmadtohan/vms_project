/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.controller;

import com.top.vms.entity.Attachment;
import com.top.vms.helper.SelectQuery;
import com.top.vms.repository.BaseRepository;
import com.top.vms.repository.BaseRepositoryParent;
import com.top.vms.repository.AttachmentRepository;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author Ahmad
 */
@RestController
@RequestMapping("/attachment")
public class AttachmentController extends BaseVmsRepositoryController<Attachment> {

    @Autowired
    AttachmentRepository attachmentRepository;

    @Override
    public BaseRepository<Attachment> getRepository() {
        return attachmentRepository;
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> upload() {
       
        return okResponse();
    }

}
