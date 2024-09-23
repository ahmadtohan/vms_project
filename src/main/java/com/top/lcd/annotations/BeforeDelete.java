package com.top.lcd.annotations;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

/**
 * @author 
 * Created on 2017-08-06
 *
 */

@Retention(RUNTIME)
@Target(METHOD)
public @interface BeforeDelete {

}
