/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.controller;

import com.top.vms.configuration.Setup;
import com.top.vms.entity.User;
import com.top.vms.helper.GenericProjection;
import com.top.vms.helper.SelectQuery;
import com.top.vms.repository.BaseRepository;
import com.top.vms.repository.BaseRepositoryParent;
import com.top.vms.repository.UserRepository;
import com.top.vms.utils.JwtTokenUtils;
import java.util.Collections;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

/**
 *
 * @author Ahmad
 */
@RestController
@RequestMapping("/user")
public class UserController extends BaseVmsRepositoryController<User> {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    JwtTokenUtils jwtTokenUtil;

    @Autowired
    UserRepository userRepository;

    @Override
    public BaseRepository<User> getRepository() {
        return userRepository;
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> login(@RequestBody User user) {

        logger.info("sigin...: ");

        Objects.requireNonNull(user.getUsername());
        Objects.requireNonNull(user.getPassword());

        //generate and return jwt token
        // Reload password post-security so we can generate the token
        final User loggedUser = userRepository.findByUsername(user.getUsername());
        final UserDetails userDetails=loggedUser;
        if (userDetails == null) {
            throw new BadCredentialsException("Bad credentials");
        }

        if (!userDetails.isEnabled()) {
            throw new DisabledException("User is disabled!");
        }

        loggedUser.setToken(jwtTokenUtil.generateToken(userDetails));

        // Return the token
        return ResponseEntity.ok(loggedUser);
    }

    @RequestMapping(value = "/search", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> search(@RequestParam(required = false) String username,
            Pageable pageable) throws Exception {
        logger.info("===========" + Setup.getCurrentUser().getEmail());
        SelectQuery<User> query = new SelectQuery(User.class);
        query.filterBy("username", "LIKE", "%" + username + "%");

        GenericProjection projection = new GenericProjection(new String[]{
            "id", "fullName", "mobileNumber", "email", "username"});
        Page<Map<String, Object>> projectionPage = projection.projectPage(query.execute(pageable), pageable);
        return new ResponseEntity<>(projectionPage, HttpStatus.OK);
    }

}
