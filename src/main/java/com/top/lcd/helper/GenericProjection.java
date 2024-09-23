package com.top.lcd.helper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.beans.PropertyAccessorFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.top.lcd.configuration.Setup;

/**
 * 
 *
 */
public class GenericProjection {
	private static final ExpressionParser _parser = new SpelExpressionParser();
	private static final ObjectMapper _object_mapper = new ObjectMapper();
	
	static {
		_object_mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		_object_mapper.setDateFormat(Setup.getDefaultDateFormat());
	}

	private List<KeyInfo> keys;

	public GenericProjection() {

	}

	public GenericProjection(String[] keys) {
		this();
		this.keys = new ArrayList<>();
		for (String key : keys) {
			String keyValue = key.trim();
			KeyInfo keyInfo = null;
			if (keyValue.startsWith("{")) { // json object of KeyInfo
				keyInfo = new KeyInfo(_parser.parseExpression(keyValue).getValue(Map.class));
			} else {
				keyInfo = new KeyInfo();
				keyInfo.setName(keyValue);
			}
			this.keys.add(keyInfo);
		}

	}

	public Map<String, Object> project(Object value) {
		Map<String, Object> result = new TreeMap<>();
		project(this.keys, value, result);
		return result;
	}
	
	public List<Map<String, Object>> projectIterable(Iterable<?> values) {
		if(values == null)
			return null;
		List<Map<String, Object>> result = new ArrayList<>();
		values.forEach(obj -> {
			Map<String, Object> matchingTypeMap = this.project(obj);
			result.add(matchingTypeMap);
		});
		return result;
	}
	
	public Page<Map<String,Object>> projectPage(Page<?> page, Pageable pageable) {
		return new PageImpl(this.projectIterable(page), pageable, page.getTotalElements());
	}

	private void project(List<KeyInfo> keys, Object value, Map<String, Object> result) {
		if (value == null) {
			result = null;
			return;
		}
		if (keys == null || keys.size() == 1 && keys.get(0).getName().trim().equals("*")) {
			result.putAll(_object_mapper.convertValue(value, Map.class));
		} else {
			for (KeyInfo keyInfo : keys) {
				Object val = getPropertyValue(value, keyInfo.getNameArray());
				List<KeyInfo> subKeys = keyInfo.getKeys();
				if (val == null || subKeys == null || subKeys.isEmpty() || subKeys.get(0).getName().trim().equals("*")) { // all keys case
					result.put(keyInfo.getLabel(), val);
				}else if(val instanceof List) {
					ArrayList<Object> listOfObjects = new ArrayList<>();
					((List) val).forEach(element -> {
						Map<String, Object> obj = new HashMap<>();
						project(keyInfo.getKeys(), element, obj);
						listOfObjects.add(obj);
					});
					result.put(keyInfo.getLabel(), listOfObjects);
				}
				else { // specific keys selected
					Map<String, Object> keyValue = new TreeMap<>();
					result.put(keyInfo.getLabel(), keyValue);
					project(subKeys, val, keyValue);
				}
			}
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
