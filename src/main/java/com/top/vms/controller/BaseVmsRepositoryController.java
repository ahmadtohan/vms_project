package com.top.vms.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.top.vms.configuration.Setup;
import com.top.vms.entity.Attachment;
import com.top.vms.entity.BaseEntity;
import com.top.vms.repository.AttachmentRepository;
import com.top.vms.repository.BaseRepositoryParent;
import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.PropertyAccessorFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author Ahmad Tohan Created 2022
 * @param <T>
 */
public abstract class BaseVmsRepositoryController<T extends BaseEntity> {

    public abstract BaseRepositoryParent<T> getRepository();

    @RequestMapping(value = "/list",
            method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> list() {
        return new ResponseEntity<>(getRepository()
                .findAll(),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/page",
            method = RequestMethod.GET)
    public ResponseEntity<?> list(Pageable pageable) {
        return new ResponseEntity<>(getRepository()
                .findAll(pageable),
                HttpStatus.OK);
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
        entity = createEntity(entity);
        return new ResponseEntity<>(entity, HttpStatus.OK);
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

    private T createEntity(T entity) {
        entity = getRepository()
                .save(entity);
        if (!entity.getAttachments().isEmpty()) {
            for (Attachment attachment : entity.getAttachments()) {
                attachment.setEntityId(entity.getId());
                attachment.setEntityType(entity.getClass().getSimpleName());
            }
            entity.setAttachments(Setup.getApplicationContext().getBean(AttachmentRepository.class).saveAll(entity.getAttachments()));
        }

        return entity;
    }

    @RequestMapping(value = "/update",
            method = RequestMethod.POST)
    @ResponseBody
    @Transactional
    public ResponseEntity<?> update(@RequestBody ObjectNode objectNode) throws IOException {
        T updated = parse(objectNode);
        T origin = getRepository()
                .findOne(updated.getId());
        update(origin,
                updated,
                objectNode);
        origin = getRepository().save(origin);
        return new ResponseEntity<>(origin,
                HttpStatus.OK);
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
                update(origin,
                        updatedOne,
                        arrayNode);
                getRepository().save(origin);
            }
            return new ResponseEntity<>(new Response("Updated"),
                    HttpStatus.OK);
        } else {
            return unauthorizedReponse();
        }
    }

    protected void update(T origin, T updated, JsonNode jsonNode) {
        BeanWrapper originBean = PropertyAccessorFactory.forBeanPropertyAccess(
                origin);
        BeanWrapper updatedBean = PropertyAccessorFactory.forBeanPropertyAccess(
                updated);
        for (Iterator<String> iter = jsonNode.fieldNames(); iter.hasNext();) {
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
        return new ResponseEntity<>(new Response("Not Found"),
                HttpStatus.NOT_FOUND);
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
