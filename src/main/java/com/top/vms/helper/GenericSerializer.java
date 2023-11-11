package com.top.vms.helper;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.top.vms.annotations.EntityJsonSerializer;
import com.top.vms.entity.BaseEntity;
import org.springframework.beans.PropertyAccessorFactory;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.BeanProperty;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.ContextualSerializer;


/**
 *
 *
 */
public class GenericSerializer extends JsonSerializer<Object> implements ContextualSerializer {

    private static Map<String, GenericSerializer> _keys_info = new ConcurrentHashMap<>();
    ExpressionParser parser = new SpelExpressionParser();

    private List<KeyInfo> keys;

    public GenericSerializer() {
        super();
    }

    public GenericSerializer(List<KeyInfo> keys) {
        super();
        this.keys = keys;
    }

    @Override
    public void serialize(Object value, JsonGenerator gen, SerializerProvider serializers)
            throws IOException, JsonProcessingException {
        if (this.keys == null)
            return;
        serialize(this.keys, value, gen, serializers);
    }

    private void serialize(List<KeyInfo> keys, Object value, JsonGenerator gen, SerializerProvider serializers)
            throws IOException, JsonProcessingException {
        if (value == null) {
            gen.writeString("");
            return;
        }

        if(value instanceof List){

            gen.writeStartArray();
            for (Object element : (List) value) {
                serialize(keys, element, gen, serializers);
            }
            gen.writeEndArray();
        }else {
            gen.writeStartObject();
            for (KeyInfo keyInfo : keys) {
                Object val = getPropertyValue(value, keyInfo.getNameArray());

                if(val instanceof List && keyInfo.getKeys() != null){
                    gen.writeFieldName(keyInfo.getLabel());
                    serialize(keyInfo.getKeys(), val, gen, serializers);
                } else if (val instanceof BaseEntity) {
                    List<KeyInfo> subKeys = keyInfo.getKeys();
                    if (subKeys.get(0).getName().trim().equals("*")) { // all keys case
                        gen.writeObjectField(keyInfo.getLabel(), val);
                    } else { // specific keys selected
                        gen.writeFieldName(keyInfo.getLabel());
                        serialize(subKeys, (BaseEntity) val, gen, serializers);
                    }

                } else {
                    gen.writeObjectField(keyInfo.getLabel(), val == null ? "" : val);
                }

            }
            gen.writeEndObject();
        }
    }

    private Object getPropertyValue(Object obj, String[] propertyArray) {
        Object objValue = obj;
        for (String property : propertyArray) {
            objValue = PropertyAccessorFactory.forBeanPropertyAccess(objValue).getPropertyValue(property);
            if (objValue == null)
                return null;
        }
        return objValue;
    }

    @Override
    public JsonSerializer<?> createContextual(SerializerProvider prov, BeanProperty property)
            throws JsonMappingException {
        if (property != null) {
            EntityJsonSerializer ann = property.getAnnotation(EntityJsonSerializer.class);
            if (ann != null) {
                String mapKey = property.getMember().getDeclaringClass().getSimpleName() + "_"
                        + property.getFullName().getSimpleName();
                if (_keys_info.containsKey(mapKey))
                    return _keys_info.get(mapKey);

                // extract keys and put them to map
                String[] keys = ann.keys();
                ArrayList<KeyInfo> keysInfo = new ArrayList<>();
                for (String key : keys) {
                    String keyValue = key.trim();
                    KeyInfo keyInfo = null;
                    if (keyValue.startsWith("{")) { // json object of KeyInfo
                        keyInfo = new KeyInfo(parser.parseExpression(keyValue).getValue(Map.class));
                    } else {
                        keyInfo = new KeyInfo();
                        keyInfo.setName(keyValue);
                    }
                    keysInfo.add(keyInfo);
                }
                GenericSerializer serializer = new GenericSerializer(keysInfo);
                _keys_info.put(mapKey, serializer);
                return serializer;
            }
        }
        return null;
    }

    class KeyInfo {
        String name;
        String label;
        List<KeyInfo> keys;
        String[] nameArray;

        public KeyInfo() {
        }

        public KeyInfo(Map<String, Object> info) {
            this();
            this.setName((String) info.get("name"));
            this.setLabel((String) info.get("label"));
            this.setKeys((List<Object>) info.get("keys"));
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
            this.nameArray = name.split("\\.");
        }

        public String[] getNameArray() {
            return this.nameArray;
        }

        public String getLabel() {
            if (label == null)
                this.label = name;
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public List<KeyInfo> getKeys() {
            return keys;
        }

        public void setKeys(List<Object> keys) {
            if (keys != null && !keys.isEmpty()) {
                this.keys = new ArrayList<>();
                for (Object key : keys) {
                    KeyInfo keyInfo;
                    if(key instanceof Map){
                        keyInfo = new KeyInfo((Map<String, Object>) key);
                    }else{
                        keyInfo = new KeyInfo();
                        keyInfo.setName((String) key);
                    }
                    this.keys.add(keyInfo);
                }
            } else
                this.keys = null;
        }

    }

}
