/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.controller;

import com.top.vms.configuration.Setup;
import com.top.vms.entity.Attachment;
import com.top.vms.repository.BaseRepository;
import com.top.vms.repository.AttachmentRepository;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Ahmad
 */
@RestController
@RequestMapping("/attachment")
public class AttachmentController extends BaseRepositoryController<Attachment> {

    @Autowired
    AttachmentRepository attachmentRepository;

    @Override
    public BaseRepository<Attachment> getRepository() {
        return attachmentRepository;
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> upload(@RequestParam(required = false) String type,
            @RequestParam("file") MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        if (attachmentRepository.findByName(fileName) != null) {
            fileName = System.currentTimeMillis() + "_" + fileName;
        }
        Files.copy(file.getInputStream(), Paths.get(Setup.getUploadPath()).resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
        Attachment attachment = new Attachment();
        attachment.setName(file.getOriginalFilename());
        attachment.setPath(Setup.getUploadPath()+ fileName);
        attachment.setType(type);
        attachment = attachmentRepository.save(attachment);

        return new ResponseEntity<>(attachment, HttpStatus.OK);
    }

    @RequestMapping(value = "/display/{idOrName}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> display(@PathVariable("idOrName") String idOrName) throws IOException {

        Attachment attachment = null;
        if (idOrName.matches("-?\\d+(\\.\\d+)?")) {
            attachment = attachmentRepository.findOne(Long.parseLong(idOrName));
        } else {
            attachment = attachmentRepository.findByName(idOrName);
        }
        if (attachment == null) {
            return notFoundResponse();
        }
        File file = new File(attachment.getPath());
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .contentLength(file.length())
                .header("Content-Disposition", String.format("inline; filename=\"" + file.getName() + "\""))
                .header("Content-Type", Files.probeContentType(Paths.get(file.getPath())))
                .body(resource);

    }

    @RequestMapping(value = "/download/{idOrName}", method = RequestMethod.GET)
    public ResponseEntity<?> download(HttpServletRequest request, HttpServletResponse response,
            @PathVariable("idOrName") String idOrName) throws IOException {
        return display(idOrName);
    }

}
