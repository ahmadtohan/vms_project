/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.configuration;

import java.text.SimpleDateFormat;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

/**
 *
 * @author Ahmad Tohan <ahmad.tohan92@gmail.com>
 */
@Component
public class Setup {

    private static EntityManagerFactory entityManagerFactory;

    private static ApplicationContext applicationContext;

    private static SimpleDateFormat defaultDateFormat = new SimpleDateFormat("yyyy-MM-dd");

    private static SimpleDateFormat defaultDateTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @Autowired
    public Setup(EntityManagerFactory entityManagerFactory,
            ApplicationContext applicationContext
    ) {
        Setup.entityManagerFactory = entityManagerFactory;
        Setup.applicationContext = applicationContext;

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

}
