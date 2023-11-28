package com.top.vms.helper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.top.vms.configuration.Setup;
import com.top.vms.entity.BaseEntity;
import java.io.Serializable;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author Ashraf Jabr <ashraf.magnamedia@gmail.com>
 * Created on Jul 4, 2017
 */
public class SelectFilter implements Serializable {

    private static final String timestampFormatString = "yyyy-MM-dd HH:mm:ss";
    private static final String dateFormatString = "yyyy-MM-dd";
    private static final DateFormat timestampFormat = new SimpleDateFormat(
            timestampFormatString);
    private static final DateFormat dateFormat = new SimpleDateFormat(
            "yyyy-MM-dd");
    private static final DateFormat timeFormat = new SimpleDateFormat(
            "HH:mm:ss");
    private static final ObjectMapper objectMapper = Setup.getApplicationContext().getBean(ObjectMapper.class);
    private static final Logger logger = Logger.getLogger(SelectFilter.class
            .getName());
    private static ObjectMapper mapper = Setup.getApplicationContext().getBean(ObjectMapper.class);
    private static TypeReference<HashMap<String, String>> typeRef
            = new TypeReference<HashMap<String, String>>() {
    };
    private String field;
    private String operation;
    private Object objectValue;
    private String value;
    private boolean and;
    private SelectFilter left;
    private SelectFilter right;
    private String fieldType;
    private String valueField;
    private boolean ignoreCase;
    private String alias;

    public SelectFilter() {
    }

    public SelectFilter(SelectFilter fb) {
        copyFrom(fb);
    }

    public SelectFilter(String field,
                        String operation,
                        Object value) {
        if (accepted(operation,
                value)) {
            this.field = field;
            this.operation = operation;
            this.objectValue = value;
        }
    }

    public SelectFilter(String alias,
                        String field,
                        String operation,
                        Object value) {
        if (accepted(operation,
                value)) {
            this.field = field;
            this.operation = operation;
            this.objectValue = value;
            this.alias = alias;
        }
    }

    public static SelectFilter load(String json) {
        try {
            SelectFilter filter = mapper.readValue(json,
                    SelectFilter.class);
            normalizeFilter(filter);
            return filter;
        } catch (Exception ex) {
            logger.log(Level.SEVERE,
                    ex.getMessage(),
                    ex);
            throw new RuntimeException(ex.getMessage());
        }
    }

    private static void normalizeFilter(SelectFilter filter) {
        if (filter == null) {
            return;
        }
        if (filter.getField() == null) {
            normalizeFilter(filter.getLeft());
            normalizeFilter(filter.getRight());
        } else {
            if (filter.getOperation() != null) {
                switch (filter.getOperation()
                        .toLowerCase()) {
                    case "equals":
                        if (filter.value == null
                                || filter.value.equalsIgnoreCase("null")) {
                            filter.setOperation("IS NULL");
                            filter.value = null;
                            filter.objectValue = null;
                        } else {
                            filter.setOperation("=");
                        }
                        break;
                    case "not equals":
                        if (filter.value == null
                                || filter.value.equalsIgnoreCase("null")) {
                            filter.setOperation("ISNOT NULL");
                            filter.value = null;
                            filter.objectValue = null;
                        } else {
                            filter.setOperation("<>");
                        }
                        break;
                    case "contains":
                        if (filter.getFieldType()
                                .equalsIgnoreCase("string")) {
                            filter.setOperation("LIKE");
                            filter.setObjectValue("%" + filter.getValue() + "%");
                        } else {
                            filter.setOperation("member of");
                        }
                        break;
                    case "not contains":
                        if (filter.getFieldType()
                                .equalsIgnoreCase("string")) {
                            filter.setOperation("NOT LIKE");
                            filter.setObjectValue("%" + filter.getValue() + "%");
                        } else {
                            filter.setOperation("not member of");
                        }
                        break;
                    case "starts with":
                        filter.setOperation("LIKE");
                        filter.setObjectValue(filter.getValue() + "%");
                        break;
                    case "not starts with":
                        filter.setOperation("NOT LIKE");
                        filter.setObjectValue(filter.getValue() + "%");
                        break;
                    case "ends with":
                        filter.setOperation("LIKE");
                        filter.setObjectValue("%" + filter.getValue());
                        break;
                    case "not ends with":
                        filter.setOperation("NOT LIKE");
                        filter.setObjectValue("%" + filter.getValue());
                        break;
                    case "is empty":
                        filter.setOperation("IS NULL");
                        filter.setValue(null);
                        filter.setObjectValue(null);
                        break;
                    case "is not empty":
                        filter.setOperation("IS NOT NULL");
                        filter.setValue(null);
                        filter.setObjectValue(null);
                        break;
                }
            }
        }
    }

    private static String readable(String operation,
                                   String value) {
        switch (operation.toLowerCase()) {
            case "=":
                return "Equals";
            case "<>":
                return "Not Equals";
            case "like":
                if (value.startsWith("%")
                        && value.endsWith("%")) {
                    return "Contains";
                } else if (value.startsWith("%")) {
                    return "Starts With";
                } else {
                    return "Ends With";
                }
            case "not like":
                if (value.startsWith("%")
                        && value.endsWith("%")) {
                    return "Doesn't Contains";
                } else if (value.startsWith("%")) {
                    return "Doesn't Starts With";
                } else {
                    return "Doesn't Ends With";
                }
            case "is null":
                return "IS EMPTY";
            case "is not null":
                return "IS NOT EMPTY";
        }
        return operation;
    }

    private void copyFrom(SelectFilter fb) {
        this.field = fb.field;
        this.operation = fb.operation;
        this.value = fb.value;
        this.objectValue = fb.objectValue;
        if (fb.left != null) {
            this.left = new SelectFilter(fb.left);
        }
        if (fb.right != null) {
            this.right = new SelectFilter(fb.right);
        }
        this.and = fb.and;
        this.fieldType = fb.fieldType;
        this.valueField = fb.valueField;
    }

    public String getField() {
        return field;
    }

    void setField(String field) {
        this.field = field;
    }

    public String getOperation() {
        return operation;
    }

    void setOperation(String operation) {
        this.operation = operation;
    }

    public String getFieldType() {
        return fieldType;
    }

    void setFieldType(String fieldType) {
        this.fieldType = fieldType;
    }

    public String getValueField() {
        return this.valueField;
    }

    public boolean isSimple() {
        return valueField == null;
    }

    public Object getValue() {
        if (objectValue == null) {
            if (fieldType != null
                    && value != null) {
                switch (fieldType) {
                    case "boolean":
                        objectValue = Boolean.parseBoolean(value);
                        break;
                    case "int":
                        objectValue = Integer.parseInt(value);
                        break;
                    case "long":
                        objectValue = Long.parseLong(value);
                        break;
                    case "double":
                        objectValue = Double.parseDouble(value);
                        break;
                    case "string":
                        objectValue = value;
                        break;
                    case "date":
                        try {
                            objectValue = dateFormat.parse(value);
                        } catch (Exception ex) {
                            logger.log(Level.SEVERE,
                                    ex.getMessage(),
                                    ex);
                        }
                        break;
                    case "timestamp":
                        try {
                            objectValue = timestampFormat.parse(value);
                        } catch (Exception ex) {
                            logger.log(Level.SEVERE,
                                    ex.getMessage(),
                                    ex);
                        }
                        break;
                    default:
                        try {
                            Class type = Class.forName(fieldType);
                            if (!type.isEnum()){
                                objectValue = objectMapper.readValue(value,
                                        type);
                                if (field.endsWith(".id")) {
                                    objectValue = ((BaseEntity) objectValue)
                                            .getId();
                                }
                            }
                        } catch (Exception ex) {
                            logger.log(Level.SEVERE,
                                    ex.getMessage(),
                                    ex);
                        }
                }
            }
        }
        return objectValue;
    }

    void setValue(String value) {
        this.value = value;
    }

    public SelectFilter and(String field,
                            String operation,
                            Object value) {
        if (accepted(operation,
                value)) {
            return and(new SelectFilter(field,
                    operation,
                    value));
        }
        return this;
    }

    public SelectFilter and(String alias,
                            String field,
                            String operation,
                            Object value) {
        if (accepted(operation,
                value)) {
            return and(new SelectFilter(alias,
                    field,
                    operation,
                    value));
        }
        return this;
    }

    public SelectFilter and(SelectFilter fb) {
        if (!fb.isEmpty()) {
            if (!this.isEmpty()) {
                if (isLeaf()) {
                    left = new SelectFilter(this.field,
                            this.operation,
                            getValue());
                    left.valueField = this.valueField;
                } else {
                    left = new SelectFilter(this);
                }
                and = true;
                right = fb;
                this.field = null;
                this.operation = null;
                this.value = null;
                this.objectValue = null;
                this.valueField = null;
            } else {
                copyFrom(fb);
            }
        }
        return this;
    }

    public SelectFilter or(String alias,
                           String field,
                           String operation,
                           Object value) {
        if (accepted(operation,
                value)) {
            return or(new SelectFilter(alias,
                    field,
                    operation,
                    value));
        }
        return this;
    }

    public SelectFilter or(String field,
                           String operation,
                           Object value) {
        if (accepted(operation,
                value)) {
            return or(new SelectFilter(field,
                    operation,
                    value));
        }
        return this;
    }

    public SelectFilter or(SelectFilter fb) {
        if (!fb.isEmpty()) {
            if (!this.isEmpty()) {
                if (isLeaf()) {
                    left = new SelectFilter(this.field,
                            this.operation,
                            getValue());
                } else {
                    left = new SelectFilter(this);
                    left.valueField = this.valueField;
                }
                and = false;
                right = fb;
                this.field = null;
                this.operation = null;
                this.value = null;
                this.objectValue = null;
                this.valueField = null;
            } else {
                copyFrom(fb);
            }
        }
        return this;
    }

    void setObjectValue(Object value) {
        this.objectValue = value;
    }

    public SelectFilter getLeft() {
        return left;
    }

    void setLeft(SelectFilter left) {
        this.left = left;
    }

    public SelectFilter getRight() {
        return right;
    }

    void setRight(SelectFilter right) {
        this.right = right;
    }

    boolean isLeaf() {
        return field != null
                && operation != null;
    }

    public boolean isAnd() {
        return and;
    }

    public void setAnd(boolean and) {
        this.and = and;
    }

    public boolean isEmpty() {
        return !isLeaf()
                && left == null
                && right == null;
    }

    public void expandAnd(String field,
                          List<String> replacers) {
        if (this.isEmpty()) {
            return;
        }
        if (this.isLeaf()) {
            if (this.field.equalsIgnoreCase(field)) {
                final Object value = getValue();
                final String operation = this.operation;
                this.field = replacers.get(0);
                for (int i = 1; i < replacers.size(); i++) {
                    this.and(replacers.get(i),
                            operation,
                            value);
                }
            }
        } else {
            this.left.expandAnd(field,
                    replacers);
            this.right.expandAnd(field,
                    replacers);
        }
    }

    public void expandOr(String field,
                         List<String> replacers) {
        if (this.isEmpty()) {
            return;
        }
        if (this.isLeaf()) {
            if (this.field.equalsIgnoreCase(field)) {
                final Object value = getValue();
                final String operation = this.operation;
                this.field = replacers.get(0);
                for (int i = 1; i < replacers.size(); i++) {
                    this.or(replacers.get(i),
                            operation,
                            value);
                }
            }
        } else {
            this.left.expandOr(field,
                    replacers);
            this.right.expandOr(field,
                    replacers);
        }
    }

    private boolean accepted(String operation,
                             Object value) {
        switch (operation.trim()
                .toUpperCase()) {
            case "IS NULL":
            case "IS NOT NULL":
            case "IS EMPTY":
                return true;
            default:
                return value != null;
        }
    }

    public String getWhereClause() {
        StringBuilder sb = new StringBuilder();
        if (this.isEmpty()) {
            return "";
        }
        if (!this.isLeaf()) {
            sb.append("(");
            sb.append(this.left.toString());
            if (this.isAnd()) {
                sb.append(") AND (");
            } else {
                sb.append(") OR (");
            }
            sb.append(this.right.toString());
            sb.append(")");
        } else {
            sb.append(this.field.toUpperCase());
            sb.append(readable(" " + this.operation + " ",
                    this.value != null ? this.value : this.valueField));
            sb.append(" ");
            if (!this.operation.trim()
                    .equalsIgnoreCase("IS NULL")
                    && !this.operation.trim()
                    .equalsIgnoreCase("IS NOT NULL")
                    && !this.operation.trim()
                    .equalsIgnoreCase("IS EMPTY")) {
                sb.append(this.value.toUpperCase());
            }
        }
        return sb.toString()
                .toUpperCase();
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        if (this.isEmpty()) {
            return "";
        }
        if (!this.isLeaf()) {
            sb.append("(");
            sb.append(this.left.toString());
            if (this.isAnd()) {
                sb.append(") AND (");
            } else {
                sb.append(") OR (");
            }
            sb.append(this.right.toString());
            sb.append(")");
        } else {
            sb.append(this.field.toUpperCase());
            sb.append(" ");
            sb.append(readable(this.operation,
                    this.value != null ? this.value : this.valueField));
            sb.append(" ");
            if (!this.operation.trim()
                    .equalsIgnoreCase("IS NULL")
                    && !this.operation.trim()
                    .equalsIgnoreCase("IS NOT NULL")
                    && !this.operation.trim()
                    .equalsIgnoreCase("IS EMPTY")) {
                if (this.value != null)
                    sb.append(this.value.toUpperCase());
                else
                    sb.append(this.objectValue);
            }
        }
        return sb.toString();
    }

    private String extractText() {
        try {
            Map<String, String> map = mapper.readValue(this.value,
                    typeRef);
            if (map.containsKey("text")) {
                return "'" + map.get("text") + "'";
            }
            if (map.containsKey("TEXT")) {
                return "'" + map.get("TEXT") + "'";
            }
            if (map.containsKey("label")) {
                return "'" + map.get("label") + "'";
            }
            if (map.containsKey("LABEL")) {
                return "'" + map.get("LABEL") + "'";
            }
            return this.value.toUpperCase();
        } catch (Exception ex) {
            logger.log(Level.SEVERE,
                    ex.getMessage(),
                    ex);
            return this.value.toUpperCase();
        }
    }

    public boolean isIgnoreCase() {
        return ignoreCase;
    }

    public SelectFilter ignoreCase() {
        this.ignoreCase = true;
        return this;
    }

    public String getAlias() {
        return alias;
    }
}
