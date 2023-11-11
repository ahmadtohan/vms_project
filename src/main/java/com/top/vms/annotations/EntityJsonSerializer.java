package com.top.vms.annotations;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * @author Ahmad Tohan
 */
@Retention(RUNTIME)
@Target(FIELD)
public @interface EntityJsonSerializer {
    String[] keys();
}
