/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.lcd.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.top.lcd.configuration.Setup;
import com.top.lcd.entity.User;
import com.top.lcd.helper.GenericProjection;
import com.top.lcd.helper.SelectQuery;
import com.top.lcd.repository.BaseRepository;
import com.top.lcd.repository.UserRepository;
import com.top.lcd.security.JwtTokenUtils;

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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
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
    public ResponseEntity<?> login(@RequestBody JsonNode user, HttpServletRequest request, HttpServletResponse response) {

        String username = user.get("username").textValue();
        String password = user.get("password").textValue();
        Objects.requireNonNull(username);
        Objects.requireNonNull(password);

        //generate and return jwt token
        // Reload password post-security so we can generate the token

        try {
            logger.info("login...: " + username + "  " + password);
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new DisabledException("User is disabled!", e);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Bad credentials!", e);
        }
        logger.info("login...2: ");
        User loggedUser = userRepository.findByUsername(username);

        String token = jwtTokenUtil.generateToken(loggedUser);
        loggedUser.setToken(token);

        Setup.setCurrentUserInMemory(loggedUser);

        GenericProjection projection = new GenericProjection(new String[]{
                "id", "username", "fullName", "email", "username", "token", "{name : 'roles', keys : {'id', 'name' ,{name:'permissions', keys : {'id', {name:'endpoint',keys:{'id','api'}}}}}}"});
        return new ResponseEntity<>(projection.project(loggedUser), HttpStatus.OK);
    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> logout(HttpServletRequest request){
        Setup.removeCurrentUserFromMemory();
        request.getSession(true).invalidate();
        return okResponse();
    }

    @RequestMapping(value = "/search", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> search(@RequestParam(required = false) String username,
                                    Pageable pageable) throws Exception {
        logger.info("===========" + Setup.getCurrentUserInfo());
        SelectQuery<User> query = new SelectQuery(User.class);
        query.filterBy("username", "LIKE", "%" + username + "%");

        GenericProjection projection = new GenericProjection(new String[]{
                "id", "fullName", "mobileNumber", "email", "username"});
        Page<Map<String, Object>> projectionPage = projection.projectPage(query.execute(pageable), pageable);
        return new ResponseEntity<>(projectionPage, HttpStatus.OK);
    }



    @Override
    protected ResponseEntity<?> getEntity(Long id) {
        User user = userRepository.findOne(id);

        GenericProjection projection = new GenericProjection(new String[]{
                "id", "fullName", "status", "username", "gender", "type","email","mobileNumber","birthDate","eid",
                "{name:'roles', keys : {'id', 'name'}}"});
        return new ResponseEntity<>(projection.project(user), HttpStatus.OK);
    }
}
