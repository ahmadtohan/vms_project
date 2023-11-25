/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.configuration;

import com.top.vms.entity.Parameter;
import com.top.vms.entity.User;
import com.top.vms.repository.ParameterRepository;
import com.top.vms.repository.UserRepository;
import com.top.vms.security.JwtTokenUtils;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import javax.persistence.EntityManagerFactory;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @author Ahmad Tohan <ahmad.tohan92@gmail.com>
 */
@Component
public class Setup implements ApplicationRunner {

    private static ParameterRepository parameterRepository;

    private static EntityManagerFactory entityManagerFactory;

    private static ApplicationContext applicationContext;

    private static JwtTokenUtils jwtTokenUtil;

    private static SimpleDateFormat defaultDateFormat = new SimpleDateFormat("yyyy-MM-dd");

    private static SimpleDateFormat defaultDateTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static final String TOKEN_HEADER = "Authorization";
    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";



   ///////////////////////////////PARAMETERS/////////////////////////////////////
    public static final String UPLOAD_PATH_PARAMETER_CODE="upload_path";
    public static final String BASE_HOST_PARAMETER_CODE="base_host";
    public static final String BASE_VMS_HOST_PARAMETER_CODE="base_vms_host";
    public static final String BASE_VERIFY_VISITOR_URL_PARAMETER_CODE="base_verify_visitor_url";


    @Override
    public void run(ApplicationArguments args) throws Exception {
        Parameter[] parameters = new Parameter[]{
                new Parameter(UPLOAD_PATH_PARAMETER_CODE, "Upload Path", "/dir/"),
                new Parameter(BASE_HOST_PARAMETER_CODE, "Base Host", "http://localhost:8088/"),
                new Parameter(BASE_VMS_HOST_PARAMETER_CODE, "Base VMS Host", "http://localhost:8088/vms/"),
                new Parameter(BASE_VERIFY_VISITOR_URL_PARAMETER_CODE, "Base Verify Visitor Url", "http://localhost:3000/vms/app/VerifyVisitor")};

        Arrays.stream(parameters).forEach(p -> {
            Parameter oldParameter = parameterRepository.findByCode(p.getCode());
            if (oldParameter == null) {
                parameterRepository.save(p);
            } else {
                oldParameter.setName(p.getName());
                oldParameter.setValue(p.getValue());
                parameterRepository.save(oldParameter);
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////
    @Autowired
    public Setup(EntityManagerFactory entityManagerFactory,
                 ApplicationContext applicationContext,
                 ParameterRepository parameterRepository,
                 JwtTokenUtils jwtTokenUtil
    ) {
        Setup.entityManagerFactory = entityManagerFactory;
        Setup.applicationContext = applicationContext;
        Setup.parameterRepository = parameterRepository;
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

    public static String getUploadPath() {
        return parameterRepository.findByCode(UPLOAD_PATH_PARAMETER_CODE).getValue();
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
