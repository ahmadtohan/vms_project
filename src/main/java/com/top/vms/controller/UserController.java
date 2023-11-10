/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.controller;

import com.top.vms.entity.User;
import com.top.vms.helper.GenericProjection;
import com.top.vms.helper.SelectQuery;
import com.top.vms.repository.BaseRepository;
import com.top.vms.repository.BaseRepositoryParent;
import com.top.vms.repository.UserRepository;
import java.util.Date;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
@RequestMapping("/user")
public class UserController extends BaseVmsRepositoryController<User> {

    @Autowired
    UserRepository userRepository;

    @Override
    public BaseRepository<User> getRepository() {
        return userRepository;
    }

    @RequestMapping(value = "/search", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> search(@RequestParam(required = false) String username,
            Pageable pageable) {
        SelectQuery<User> query = new SelectQuery(User.class);
        query.filterBy("username", "LIKE", "%" + username + "%");

        GenericProjection projection = new GenericProjection(new String[]{
            "id", "fullName", "mobileNumber", "email", "username"});
        Page<Map<String, Object>> projectionPage = projection.projectPage(query.execute(pageable), pageable);
        return new ResponseEntity<>(projectionPage, HttpStatus.OK);
    }

}
