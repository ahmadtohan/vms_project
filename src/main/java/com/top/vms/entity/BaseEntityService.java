package com.top.vms.entity;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.top.vms.annotations.AfterDelete;
import com.top.vms.annotations.AfterInsert;
import com.top.vms.annotations.AfterUpdate;
import com.top.vms.annotations.BeforeDelete;
import com.top.vms.annotations.BeforeInsert;
import com.top.vms.annotations.BeforeUpdate;
import com.top.vms.configuration.Setup;

import org.aspectj.lang.ProceedingJoinPoint;
import org.hibernate.StaleObjectStateException;
import org.hibernate.dialect.lock.OptimisticEntityLockException;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.persistence.Entity;
import javax.persistence.OptimisticLockException;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import org.springframework.web.reactive.function.client.WebClientResponseException;

/**
 * @author Created on 2017-08-06
 */
@Service
public class BaseEntityService {

    private static final HashMap<Class, List<Method>> beforeInsertMap = new HashMap<>();
    private static final HashMap<Class, List<Method>> afterInsertMap = new HashMap<>();
    private static final HashMap<Class, List<Method>> beforeUpdateMap = new HashMap<>();
    private static final HashMap<Class, List<Method>> afterUpdateMap = new HashMap<>();
    private static final HashMap<Class, List<Method>> beforeDeleteMap = new HashMap<>();
    private static final HashMap<Class, List<Method>> afterDeleteMap = new HashMap<>();

    private static boolean created;

    private static final Logger logger = Logger.getLogger(
            BaseEntityService.class.getName());

    @PostConstruct
    public void init() {
        if (!created) {
            ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(
                    false);
            scanner.addIncludeFilter(new AnnotationTypeFilter(Entity.class));
            scanner.findCandidateComponents("com.top").stream().map(
                    bd -> bd.getBeanClassName())
                    .forEachOrdered(className -> {
                        try {
                            Class<?> cls = Class.forName(className);
                            List<Method> methods = new ArrayList<>(
                                    Arrays.asList(cls.getDeclaredMethods()));
                            Class<?> superClass = cls.getSuperclass();
                            while (superClass != null && !superClass.getName().equalsIgnoreCase(
                                    "java.lang.Object")) {
                                List<Method> superMethods = Arrays.asList(
                                        superClass.getDeclaredMethods());
                                superMethods.stream().filter(
                                        (method) -> (!methods.contains(method)))
                                        .forEachOrdered((method) -> {
                                            methods.add(method);
                                        });
                                superClass = superClass.getSuperclass();
                            }
                            methods.stream().forEachOrdered((method) -> {
                                registerCallbacks(cls,
                                        BeforeInsert.class,
                                        method);
                                registerCallbacks(cls,
                                        AfterInsert.class,
                                        method);
                                registerCallbacks(cls,
                                        BeforeUpdate.class,
                                        method);
                                registerCallbacks(cls,
                                        AfterUpdate.class,
                                        method);
                                registerCallbacks(cls,
                                        BeforeDelete.class,
                                        method);
                                registerCallbacks(cls,
                                        AfterDelete.class,
                                        method);
                            });
                        } catch (ClassNotFoundException e) {
                            throw new RuntimeException(e);
                        }
                    });
            created = true;
        }
    }

    @Transactional
    public Object save(ProceedingJoinPoint point) throws Throwable {
        Object savedOject = point.getArgs()[0];
        if (savedOject instanceof List
                && !((List) savedOject).isEmpty()
                && ((List) savedOject).get(0) instanceof BaseEntity) {
            return saveList(point);
        } else if (!(savedOject instanceof BaseEntity)) {
            return point.proceed();
        }
        try {
            BaseEntity entity = (BaseEntity) point.getArgs()[0];
            boolean isNewInstance = entity.getId() == null ? true : false;
            executeCallbacks(entity,
                    isNewInstance ? BeforeInsert.class : BeforeUpdate.class);
            BaseEntity result = (BaseEntity) point.proceed();
            executeCallbacks(result,
                    isNewInstance ? AfterInsert.class : AfterUpdate.class);
            return result;
        } catch (Exception e) {
            logger.log(Level.SEVERE,
                    e.getMessage(),
                    e);

            throw e;
        }

    }

    @Transactional
    public Object delete(ProceedingJoinPoint point) throws Throwable {
        Object savedOject = point.getArgs()[0];
        if (savedOject instanceof List
                && !((List) savedOject).isEmpty()
                && ((List) savedOject).get(0) instanceof BaseEntity) {
            return deleteList(point);
        } else if (!(savedOject instanceof BaseEntity) || savedOject instanceof Long) {
            return point.proceed();
        }
        try {
            BaseEntity entity = (BaseEntity) point.getArgs()[0];
            executeCallbacks(entity,
                    BeforeDelete.class);
            try {
                Object result = point.proceed();
                executeCallbacks(entity,
                        AfterDelete.class);
                return result;
            } catch (Exception ex) {
                logger.log(Level.SEVERE,
                        ex.getMessage(),
                        ex);
                throw ex;
            }
        } catch (Exception ex) {
            logger.log(Level.SEVERE,
                    ex.getMessage(),
                    ex);
            throw new RuntimeException(ex.getMessage());
        }

    }

    private Object saveList(ProceedingJoinPoint point) throws Throwable {
        List<SavedBaseEntityContainer> entities = (List<SavedBaseEntityContainer>) ((List) point.getArgs()[0])
                .stream()
                .map(t -> new SavedBaseEntityContainer((BaseEntity) t))
                .collect(Collectors.toList());
        try {
            entities.forEach(entity -> {
                executeCallbacks(entity,
                        entity.isNewInstance ? BeforeInsert.class : BeforeUpdate.class);
            });
            Object result = point.proceed();
            entities.forEach(entity -> {
                executeCallbacks(entity,
                        entity.isNewInstance ? AfterInsert.class : AfterUpdate.class);
            });
            return result;
        } catch (OptimisticLockException | OptimisticEntityLockException | StaleObjectStateException
                | OptimisticLockingFailureException ex) {
            logger.log(Level.SEVERE,
                    ex.getMessage(),
                    ex);

            throw ex;
        } catch (Exception e) {
            throw e;
        }

    }

    private Object deleteList(ProceedingJoinPoint point) throws Throwable {
        List<BaseEntity> entities = (List<BaseEntity>) ((List) point.getArgs()[0])
                .stream()
                .map(t -> (BaseEntity) t)
                .collect(Collectors.toList());
        try {
            entities.forEach(entity -> {
                executeCallbacks(entity,
                        BeforeDelete.class);
            });
            Object result = point.proceed();
            entities.forEach(entity -> {
                executeCallbacks(entity,
                        AfterDelete.class);
            });
            return result;
        } catch (Exception ex) {
            logger.log(Level.SEVERE,
                    ex.getMessage(),
                    ex);
            throw new RuntimeException(ex.getMessage());
        }

    }

    private void registerCallbacks(Class cls,
            Class annotationCls,
            Method method) {
        if (!method.isAnnotationPresent(annotationCls)) {
            return;
        }
        Class returnType = method.getReturnType();
        Class[] args = method.getParameterTypes();
        if (returnType != Void.TYPE || args.length != 0) {
            throw new RuntimeException(
                    "Callback methods annotated on the bean class must return void and take no arguments: "
                    + annotationCls.getName() + " - " + method.getName());
        }
        Map<Class, List<Method>> callbackMap = getCallbackMap(annotationCls);
        if (!callbackMap.containsKey(cls)) {
            callbackMap.put(cls,
                    new ArrayList<>());
        }
        method.setAccessible(true);
        callbackMap.get(cls).add(method);
    }

    private void executeCallbacks(Object obj,
            Class annotationCls) {
        if (obj instanceof NoCallbacks) {
            return;
        }
        Map<Class, List<Method>> callbackMap = getCallbackMap(annotationCls);
        Class cls = obj.getClass();
        if (obj instanceof HibernateProxy) {
            cls = ((HibernateProxy) obj).getHibernateLazyInitializer().getImplementation().getClass();
        }
        List<Method> callbackMethods = callbackMap.get(cls);
        if (callbackMethods != null) {
            callbackMethods.forEach(m -> {
                try {
                    m.invoke(obj);
                } catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
                    logger.log(Level.SEVERE, e.getMessage(), e);
                    try {
                        Throwable cause = e;
                        if (cause.getClass().getCanonicalName().startsWith("java.lang")) {
                            throw new RuntimeException(e.getCause().getMessage(), cause);
                        } else {
                            Throwable wrapedCause = getNewInstanceException(cause);
                            if (wrapedCause instanceof RuntimeException) {
                                throw (RuntimeException) wrapedCause;
                            }
                            throw new RuntimeException(e.getCause().getMessage(), wrapedCause);
                        }
                    } catch (ClassNotFoundException
                            | IllegalAccessException
                            | InstantiationException
                            | NoSuchMethodException
                            | InvocationTargetException ex) {
                        logger.log(Level.SEVERE, ex.getMessage(), ex);
                        throw new RuntimeException(ex.getMessage(), ex);
                    }
                }
            });
        }
    }

    private Map<Class, List<Method>> getCallbackMap(Class annotationCls) {
        if (annotationCls == BeforeInsert.class) {
            return beforeInsertMap;
        }
        if (annotationCls == AfterInsert.class) {
            return afterInsertMap;
        }
        if (annotationCls == BeforeUpdate.class) {
            return beforeUpdateMap;
        }
        if (annotationCls == AfterUpdate.class) {
            return afterUpdateMap;
        }
        if (annotationCls == BeforeDelete.class) {
            return beforeDeleteMap;
        }
        if (annotationCls == AfterDelete.class) {
            return afterDeleteMap;
        }
        return null;
    }

    private class SavedBaseEntityContainer {

        private BaseEntity baseEntity;
        private boolean isNewInstance;

        public SavedBaseEntityContainer(BaseEntity baseEntity) {
            this.baseEntity = baseEntity;
            this.isNewInstance = this.baseEntity.getId() == null ? true : false;
        }
    }

    private Throwable getNewInstanceException(Throwable cause)
            throws ClassNotFoundException,
            InstantiationException,
            IllegalAccessException,
            IllegalArgumentException,
            InvocationTargetException,
            NoSuchMethodException {
        try {
            if (cause instanceof WebClientResponseException) {
                String message = "";
                try {
                    Map<String, Object> map = Setup.getApplicationContext()
                            .getBean(ObjectMapper.class).readValue(
                            ((WebClientResponseException) cause).getResponseBodyAsString(),
                            new TypeReference<HashMap<String, Object>>() {
                    });
                    if (map.get("rootException") != null) {
                        message = (String) String.format("%s: %s",
                                map.get("rootException"),
                                map.get("rootMessage"));
                    }
                } catch (Exception ex1) {
                    logger.log(Level.SEVERE,
                            "Failed to extract exception message.");
                }
                return new RuntimeException(
                        message.isEmpty()
                        ? ((WebClientResponseException) cause).getResponseBodyAsString()
                        : message);
            }
            Class exceptionClass = Class.forName(cause.getClass().getCanonicalName());
            Constructor throwableConstructor = Arrays.asList(exceptionClass.getConstructors())
                    .stream()
                    .filter(c -> c.getParameterCount() == 1
                    && c.getParameterTypes()[0]
                            .equals(Throwable.class))
                    .findFirst()
                    .orElse(null);
            if (throwableConstructor != null) {
                return (Throwable) throwableConstructor.newInstance((Throwable) cause);
            } else {
                Constructor anyConstructor = exceptionClass.getConstructors()[0];
                Object[] parameters = new Object[anyConstructor.getParameterCount()];
                for (int i = 0; i < anyConstructor.getParameterCount(); i++) {
                    parameters[i] = null;
                }
                return (Throwable) anyConstructor.newInstance(parameters);
            }
        } catch (ClassNotFoundException ex) {
            logger.log(Level.SEVERE, String.format("%s: %s",
                    ex.getClass().getCanonicalName(), ex.getMessage()));
            return new RuntimeException(cause.getMessage(), cause);
        }
    }
}
