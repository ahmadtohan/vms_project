package com.top.vms.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.top.vms.configuration.Setup;
import com.top.vms.entity.BaseEntity;
import com.top.vms.entity.User;
import com.top.vms.helper.SelectQuery;
import com.top.vms.repository.BaseRepositoryParent;

import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.PropertyAccessorFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;

/**
 * @param <T>
 * @author Ahmad Tohan Created 2022
 */
public abstract class BaseRepositoryController<T extends BaseEntity> {

    private static final Logger logger = LoggerFactory.getLogger(BaseRepositoryController.class);

    public abstract BaseRepositoryParent<T> getRepository();

    @RequestMapping(value = "/list",
            method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> list() {
        return new ResponseEntity<>(getRepository()
                .findAll(),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/page", method = RequestMethod.POST)
    public ResponseEntity<?> list(Pageable pageable, @RequestBody(required = false) List<JsonNode> jsonNode) throws NoSuchFieldException {

        SelectQuery<Object> query = new SelectQuery(getEntityClass());
        if (jsonNode != null) {
            List<Object> list = getObjectMapper().convertValue(jsonNode, new TypeReference<List<Object>>() {
            });
            for (Object object : list) {
                Map<String, Object> map = getObjectMapper().convertValue(object, new TypeReference<Map<String, Object>>() {
                });
                Field field = getEntityClass().getDeclaredField(map.get("field").toString());
                Class fieldType = field.getType();
                Object value = map.get("value");
                if (fieldType.isEnum()) {
                    value = Enum.valueOf(fieldType, value.toString());
                }
                query.filterBy(map.get("field").toString(), map.get("operation").toString(), value).setAnd(false);
            }
        }

        return new ResponseEntity<>(query.execute(pageable), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}",
            method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> get(@PathVariable("id") Long id) {
        T entity = getRepository().findOne(id);
        if (entity != null) {
            entity.loadAttachments();
        }
        return new ResponseEntity<>(entity, HttpStatus.OK);

    }

    @RequestMapping(value = "/create",
            method = RequestMethod.POST)
    @ResponseBody
    @Transactional
    public ResponseEntity<?> create(@RequestBody T entity) {
        return createEntity(entity);
    }

    @RequestMapping(value = "/createAll",
            method = RequestMethod.POST)
    @ResponseBody
    @Transactional
    public ResponseEntity<?> create(@RequestBody List<T> entities) {
        entities.stream()
                .filter((entity)
                        -> (entity.getId() == null))
                .forEachOrdered((entity)
                        -> {
                    createEntity(entity);
                });
        return okResponse();

    }

    protected ResponseEntity<?> createEntity(T entity) {
        entity = getRepository().save(entity);
        return new ResponseEntity<>(entity, HttpStatus.OK);
    }

    @RequestMapping(value = "/update",
            method = RequestMethod.POST)
    @ResponseBody
    @Transactional
    public ResponseEntity<?> update(@RequestBody ObjectNode objectNode) throws IOException {
        if (checkPermission("update")) {
            T updated = parse(objectNode);
            T origin = getRepository()
                    .findOne(updated.getId());
            update(origin, updated, objectNode);
            return updateEntity(origin);
        }
        return unauthorizedReponse();
    }

    @RequestMapping(value = "/updateAll",
            method = RequestMethod.POST)
    @ResponseBody
    @Transactional
    public ResponseEntity<?> update(@RequestBody ArrayNode arrayNode) throws IOException {
        if (checkPermission("update")) {
            List<T> updated = parse(arrayNode);
            for (T updatedOne : updated) {
                T origin = getRepository()
                        .findOne(updatedOne.getId());
                update(origin, updatedOne, arrayNode);
                updateEntity(origin);
            }
            return new ResponseEntity<>(new Response("Updated"),
                    HttpStatus.OK);
        } else {
            return unauthorizedReponse();
        }
    }

    protected ResponseEntity<?> updateEntity(T entity) {
        getRepository().save(entity);
        return new ResponseEntity<>(new Response("Updated"),
                HttpStatus.OK);
    }

    protected void update(T origin, T updated, JsonNode jsonNode) {
        BeanWrapper originBean = PropertyAccessorFactory.forBeanPropertyAccess(
                origin);
        BeanWrapper updatedBean = PropertyAccessorFactory.forBeanPropertyAccess(
                updated);
        for (Iterator<String> iter = jsonNode.fieldNames(); iter.hasNext(); ) {
            String key = iter.next();
            JsonNode node = jsonNode.get(key);
            if (node.isObject()) { // for one-to-one or many-to-one relations
                T originPropertyValue = (T) originBean.getPropertyValue(key);
                T updatedPropertyValue = (T) updatedBean.getPropertyValue(key);
                if (updatedPropertyValue == null) {
                    originBean.setPropertyValue(key, null);
                } else if (originPropertyValue != null
                        && (updatedPropertyValue.getId() == null
                        || originPropertyValue.getId()
                        .longValue()
                        == updatedPropertyValue.getId()
                        .longValue())) {
                    update(originPropertyValue,
                            updatedPropertyValue,
                            node);
                } else {
                    originBean.setPropertyValue(key,
                            updatedPropertyValue);
                }
            } else {
                if ("version".equalsIgnoreCase(key)) {
                    Long originVersion = (Long) originBean.getPropertyValue(key);
                    Long updatedVersion = (Long) updatedBean.getPropertyValue(
                            key);
                    if (!Objects.equals(originVersion,
                            updatedVersion)) {
                        throw new RuntimeException(
                                "Current Information is out of date. You need to refresh before saving updates");
                    }
                } else {
                    originBean.setPropertyValue(key,
                            updatedBean
                                    .getPropertyValue(key));
                }
            }
        }
    }

    protected final List<T> parse(ArrayNode arrayNode) throws IOException {
        List<T> objects = new ArrayList<>();
        for (JsonNode objectNode : arrayNode) {
            objects.add(getObjectMapper()
                    .treeToValue(objectNode,
                            getEntityClass()));
        }
        return objects;
    }

    protected final T parse(ObjectNode jsonNode) throws IOException {
        return getObjectMapper()
                .treeToValue(jsonNode,
                        getEntityClass());
    }

    protected ObjectMapper getObjectMapper() {
        return new ObjectMapper();
    }

    @RequestMapping(value = "/delete/{id}",
            method = RequestMethod.DELETE)
    @ResponseBody
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("id") T entity) {
        if (checkPermission("delete")) {
            getRepository().delete(entity);
            return okResponse();
        } else {
            return unauthorizedReponse();
        }
    }

    @RequestMapping(value = "/deleteAll/{ids}",
            method = RequestMethod.DELETE)
    @ResponseBody
    @Transactional
    public ResponseEntity<?> delete(@PathVariable("ids") List<Long> ids) {
        if (checkPermission("delete")) {
            for (Long id : ids) {
                getRepository().delete(id);
            }
            return okResponse();
        } else {
            return unauthorizedReponse();
        }
    }

    protected Class<T> getEntityClass() {
        Type type = getClass()
                .getGenericSuperclass();
        if (type instanceof ParameterizedType) {
            return (Class<T>) ((ParameterizedType) type)
                    .getActualTypeArguments()[0];
        } else {
            return (Class<T>) ((ParameterizedType) type.getClass()
                    .getGenericSuperclass())
                    .getActualTypeArguments()[0];
        }
    }

    protected boolean checkPermission(String apiName) {
        return true;
    }

    protected ResponseEntity<?> unauthorizedReponse() {
        return new ResponseEntity<>(new Response("Access denied"),
                HttpStatus.UNAUTHORIZED);
    }

    protected ResponseEntity<?> badRequestResponse() {
        return new ResponseEntity<>(new Response(
                "Problem occured during processing"),
                HttpStatus.BAD_REQUEST);
    }

    protected ResponseEntity<?> okResponse() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    protected ResponseEntity<?> notFoundResponse() {
        return new ResponseEntity<>(new Response("Not Found"), HttpStatus.NOT_FOUND);
    }

    protected static class Response {

        private final String message;

        public Response(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
