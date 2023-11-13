/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.configuration;

import com.top.vms.entity.User;
import com.top.vms.repository.UserRepository;
import com.top.vms.utils.JwtTokenUtils;
import io.jsonwebtoken.ExpiredJwtException;
import java.text.SimpleDateFormat;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 *
 * @author Ahmad Tohan <ahmad.tohan92@gmail.com>
 */
@Component
public class Setup {

    private static EntityManagerFactory entityManagerFactory;

    private static ApplicationContext applicationContext;

    private static JwtTokenUtils jwtTokenUtil;

    private static SimpleDateFormat defaultDateFormat = new SimpleDateFormat("yyyy-MM-dd");

    private static SimpleDateFormat defaultDateTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static final String TOKEN_HEADER = "Authorization";
    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    @Autowired
    public Setup(EntityManagerFactory entityManagerFactory,
            ApplicationContext applicationContext,
            JwtTokenUtils jwtTokenUtil
    ) {
        Setup.entityManagerFactory = entityManagerFactory;
        Setup.applicationContext = applicationContext;
        Setup.jwtTokenUtil = jwtTokenUtil;

    }

    public static EntityManagerFactory getEntityManagerFactory() {
        return entityManagerFactory;
    }

    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    public static SimpleDateFormat getDefaultDateFormat() {
        return defaultDateFormat;
    }

    public static SimpleDateFormat getDefaultDateTimeFormat() {
        return defaultDateTimeFormat;
    }

    public static User getCurrentUser() throws Exception {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        final String requestHeader = request.getHeader(Setup.TOKEN_HEADER);
        if (requestHeader != null && requestHeader.startsWith("Bearer ")) {
            return applicationContext.getBean(UserRepository.class).findByUsername(jwtTokenUtil.getUsernameFromToken(requestHeader.substring(7)));

        }
        throw new Exception("User not found");
    }

}
