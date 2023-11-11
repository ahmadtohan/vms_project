package com.top.vms.entity;


import java.util.logging.Level;
import java.util.logging.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author  Created on 2017-08-06
 */
@Aspect
@Component
public class BaseEntityAOP {

        private static final Logger logger = Logger.getLogger(BaseEntityAOP.class.getName());

        @Autowired
        private BaseEntityService entityService;
        
	@Around("execution(* com.top.vms.repository..*.save(..))")
	public Object onSaveEntity(ProceedingJoinPoint point) throws Throwable {
		return entityService.save(point);
	}
        
        @Around("execution(* com.top.vms.repository..*.silentSave(..))")
        public Object onSilentSaveEntity(ProceedingJoinPoint point) throws Throwable {
  
                return entityService.save(point);
          
        }

	@Around("execution(* com.top.vms.repository..*.saveWithFlush(..))")
	public Object onSaveAndFlushEntity(ProceedingJoinPoint point) throws Throwable {
		return entityService.save(point);
	}

	@Around("execution(* com.top.vms.repository..*.delete(..))")
	public Object onDeleteEntity(ProceedingJoinPoint point) throws Throwable {
		return entityService.delete(point);
	}

}
