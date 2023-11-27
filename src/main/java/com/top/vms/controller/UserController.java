/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.top.vms.configuration.Setup;
import com.top.vms.entity.User;
import com.top.vms.helper.GenericProjection;
import com.top.vms.helper.SelectQuery;
import com.top.vms.repository.BaseRepository;
import com.top.vms.repository.UserRepository;
import com.top.vms.security.JwtTokenUtils;

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

/**
 *
 * @author Ahmad
 */
@RestController
@RequestMapping("/user")
public class UserController extends BaseRepositoryController<User> {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    JwtTokenUtils jwtTokenUtil;


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Override
    public BaseRepository<User> getRepository() {
        return userRepository;
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> login(@RequestBody JsonNode user) {

        String username = user.get("username").textValue();
        String password = user.get("password").textValue();
        Objects.requireNonNull(username);
        Objects.requireNonNull(password);

        //generate and return jwt token
        // Reload password post-security so we can generate the token

        try {
            logger.info("login...: "+username+"  "+ password);
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new DisabledException("User is disabled!", e);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Bad credentials!", e);
        }
        User loggedUser = userRepository.findByUsername(username);
        String token=jwtTokenUtil.generateToken(loggedUser);
        loggedUser.setToken(token);

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
