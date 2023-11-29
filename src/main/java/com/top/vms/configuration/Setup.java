/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.configuration;

import com.top.vms.controller.UserController;
import com.top.vms.entity.Endpoint;
import com.top.vms.entity.Parameter;
import com.top.vms.entity.User;
import com.top.vms.repository.EndpointRepository;
import com.top.vms.repository.ParameterRepository;
import com.top.vms.repository.UserRepository;
import com.top.vms.security.JwtTokenUtils;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import javax.persistence.EntityManagerFactory;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;


/**
 * @author Ahmad Tohan <ahmad.tohan92@gmail.com>
 */
@Component
public class Setup implements ApplicationRunner, ApplicationListener<ContextRefreshedEvent> {
    private static final Logger logger = LoggerFactory.getLogger(Setup.class);

    private static ParameterRepository parameterRepository;

    private static EntityManagerFactory entityManagerFactory;

    private static ApplicationContext applicationContext;

    private static JwtTokenUtils jwtTokenUtil;

    private static SimpleDateFormat defaultDateFormat = new SimpleDateFormat("yyyy-MM-dd");

    private static SimpleDateFormat defaultDateTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static final String TOKEN_HEADER = "Authorization";


    ///////////////////////////////PARAMETERS/////////////////////////////////////
    public static final String UPLOAD_PATH_PARAMETER_CODE = "upload_path";
    public static final String BASE_HOST_PARAMETER_CODE = "base_host";
    public static final String BASE_VMS_HOST_PARAMETER_CODE = "base_vms_host";
    public static final String BASE_VERIFY_VISITOR_URL_PARAMETER_CODE = "base_verify_visitor_url";


    @Override
    public void run(ApplicationArguments args) throws Exception {
        Parameter[] parameters = new Parameter[]{
                new Parameter(UPLOAD_PATH_PARAMETER_CODE, "Upload Path", "/dir/"),
                new Parameter(BASE_HOST_PARAMETER_CODE, "Base Host", "http://localhost:8088/"),
                new Parameter(BASE_VMS_HOST_PARAMETER_CODE, "Base VMS Host", "http://localhost:8088/vms/"),
                new Parameter(BASE_VERIFY_VISITOR_URL_PARAMETER_CODE, "Base Verify Visitor Url", "http://localhost:3000/vms/app/verifyVisitor")};

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

    public static User getCurrentUser()  {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        final String requestHeader = request.getHeader(Setup.TOKEN_HEADER);
        if (requestHeader != null && requestHeader.startsWith("Bearer ")) {
                return applicationContext.getBean(UserRepository.class).findByUsername(jwtTokenUtil.getUsernameFromToken(requestHeader.substring(7)));

        }
        return null;
    }


    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        RequestMappingHandlerMapping requestMappingHandlerMapping = applicationContext
                .getBean(RequestMappingHandlerMapping.class);
        Map<RequestMappingInfo, HandlerMethod> map = requestMappingHandlerMapping
                .getHandlerMethods();
        map.forEach((key, value) -> {
            Iterator<String> namesIterator = key.getPatternsCondition().getPatterns().iterator();
            EndpointRepository endpointRepository = applicationContext.getBean(EndpointRepository.class);
            while (namesIterator.hasNext()) {
                String api = namesIterator.next();
                if (endpointRepository.findByApi(api) == null) {
                    Endpoint endpoint = new Endpoint();
                    endpoint.setApi(api);
                    endpointRepository.save(endpoint);
                }


            }
        });
        logger.info("========================Endpoint-done====");
    }
}
