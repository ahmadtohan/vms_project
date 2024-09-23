package com.top.lcd.helper;

import com.top.lcd.configuration.Setup;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.persistence.EntityManager;
import javax.persistence.LockModeType;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import org.hibernate.internal.SessionImpl;
import org.springframework.data.domain.*;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.repository.Lock;

/**
 *
 * 
 * Created on Jul 4, 2017
 */
public class SelectQuery<T> {

    private SelectFilter filter;
    private final List<SortBy> sorters = new ArrayList<>();
    private final Class<T> entityClass;
    private final Map<Join, String> joins = new LinkedHashMap<>();
    private int joinIndex;
    private String alias;
    private String directQuery;
    private String directCountQuery;
    private Map<String, Object> directQueryParameters;
    protected EntityManager em;
    private Integer limit;
    private List<QueryInterceptor> interceptors = new ArrayList<>();
    private boolean cacheResult = false;
    private boolean distinct = false;
    private Pageable pageRequest = PageRequest.of(0,
            20);
    private Long queryCountValue = null;
    private boolean withTotalCount = true;
    private boolean usingNestedJoin = false;
    private boolean allowNestedJoinsWithPageable = false;
    private static final Logger logger = Logger.getLogger(SelectQuery.class
            .getName());

    public SelectQuery(String directQuery,
                       String directCountQuery,
                       Class<T> resultClass) {
        this.directQuery = directQuery;
        this.directCountQuery = directCountQuery;
        this.entityClass = resultClass;
    }

    public SelectQuery(String directQuery,
                       String directCountQuery,
                       Class<T> resultClass,
                       Map<String, Object> parameters) {
        this.directQuery = directQuery;
        this.directCountQuery = directCountQuery;
        this.entityClass = resultClass;
        this.directQueryParameters = parameters;
    }

    public SelectQuery(Class<T> entityClass) {
        this.entityClass = entityClass;
        this.alias = getAlias(entityClass);
    }

    public SelectFilter filterBy(SelectFilter fb) {
        if (fb != null) {
            if (this.filter == null) {
                this.filter = fb;
            } else {
                this.filter.and(fb);
            }
        }
        return this.filter;
    }

    /**
     * Add Filter as AND condition
     *
     * @param field
     * @param operation
     * @param value
     */
    public SelectFilter filterBy(String field,
                                 String operation,
                                 Object value) {
        if (filter == null) {

            filter = new SelectFilter(field,
                    operation,
                    value);
        } else {
            filter.and(field,
                    operation,
                    value);
        }
        return filter;
    }
    
    public SelectFilter filterBy(String alias,
                                 String field,
                                 String operation,
                                 Object value) {
        if (filter == null) {
            filter = new SelectFilter(alias,
                    field,
                    operation,
                    value);
        } else {
            filter.and(alias,
                    field,
                    operation,
                    value);
        }
        return filter;
    }

    public SelectQuery sortBy(String field,
                              boolean ascending) {
        sorters.add(new SortBy(field,
                ascending));
        return this;
    }

    public SelectQuery sortBy(String field,
                              boolean ascending,
                              boolean nullsLast) {
        sorters.add(new SortBy(field,
                ascending,
                nullsLast));
        return this;
    }

    public SelectQuery join(String field) {
        joins.put(new Join(field),
                "__j__" + ++joinIndex);
        return this;
    }

    public SelectQuery joinFetch(String field) {
        joins.put(new Join(field,
                        false,
                        true),
                "__j__" + ++joinIndex);
        return this;
    }

    public SelectQuery joinFetch(String field, String fieldAlias) {
        joins.put(new Join(field,
                        false,
                        true),
                fieldAlias);
        ++joinIndex;
        return this;
    }

    public SelectQuery nestedJoinFetch(String parentAlias, String field) {
        joins.put(new Join(parentAlias,
                        field,
                        false),
                "__j__" + ++joinIndex);
        this.usingNestedJoin = true;
        return this;
    }

    public SelectQuery nestedJoinFetch(String parentAlias, String field, String alias) {
        joins.put(new Join(parentAlias,
                        field,
                        false),
                alias);
        this.usingNestedJoin = true;
        ++joinIndex;
        return this;
    }

    public SelectQuery leftJoin(String field) {
        joins.put(new Join(field,
                        true),
                "__j__" + ++joinIndex);
        return this;
    }

    public SelectQuery leftJoinFetch(String field) {
        joins.put(new Join(field,
                        true,
                        true),
                "__j__" + ++joinIndex);
        return this;
    }

    public SelectQuery leftJoinFetch(String field, String alies) {
        joins.put(new Join(field,
                        true,
                        true),
                alies);
        ++joinIndex;
        return this;
    }

    public SelectQuery nestedLeftJoinFetch(String parentAlias, String field) {
        joins.put(new Join(parentAlias,
                        field,
                        true),
                "__j__" + ++joinIndex);
        this.usingNestedJoin = true;
        return this;
    }

    public SelectQuery nestedLeftJoinFetch(String parentAlias, String field, String alias) {
        joins.put(new Join(parentAlias,
                        field,
                        true),
                alias);
        ++joinIndex;
        this.usingNestedJoin = true;
        return this;
    }
    

    @Lock(LockModeType.READ)
    public List<T> execute() {
        try {
            List<T> result = createQuery(null,
                    false)
                    .execute();
            return result;
        } finally {
            closeEntityManager();
        }
    }

    public SelectQuery cacheResult() {
        this.cacheResult = true;
        return this;
    }

    public SelectQuery distinct() {
        this.distinct = true;
        return this;
    }

    public SelectQuery withTotalCount(boolean withTotalCount) {
        this.withTotalCount = withTotalCount;
        return this;
    }

    @Lock(LockModeType.READ)
    public Page<T> execute(Pageable pageable) {
        if (!this.allowNestedJoinsWithPageable && this.withTotalCount && this.usingNestedJoin) {
            throw new RuntimeException("You Can't use nested join fetch with pageable execute");
        }
        Page<T> result = createQuery(pageable,
                false)
                .execute(pageable);
        closeEntityManager();
        Sort sort = pageable.getSort() != null
                ? pageable.getSort()
                .and(Sort.by("id"))
                : Sort.by("id");
        pageRequest = PageRequest.of(pageable.getPageNumber(),
                pageable.getPageSize(),
                sort);
        return result;
    }

    @Lock(LockModeType.READ)
    public Page<T> getNextPage() {
        pageRequest = pageRequest.next();
        Page<T> result = createQuery(pageRequest,
                false)
                .execute(pageRequest);
        closeEntityManager();
        return result;
    }

    @Lock(LockModeType.READ)
    public Number executeScalar() {
        Number result = createQuery(null,
                true)
                .executeScalar();
        closeEntityManager();
        return result;
    }

    @Lock(LockModeType.READ)
    public Date executeScalarDate() {
        Date result = createQuery(null,
                true)
                .executeScalarDate();
        closeEntityManager();
        return result;
    }

    private ExecutableQuery createQuery(Pageable pageable,
                                        boolean intercept) {
        Map<String, Object> params;
        String queryString;
        String countQueryString;
        if (directQuery != null) {
            queryString = directQuery;
            params = directQueryParameters;
            countQueryString = directCountQuery;
        } else {
            JpqlGenerateResult jgr = generateJpql(pageable,
                    intercept,
                    distinct);
            queryString = jgr.getQuery();
            countQueryString = jgr.getCountQuery();
            params = jgr.getParametersMap();
        }
        return new ExecutableQuery(queryString,
                countQueryString,
                params,
                cacheResult);
    }

    private JpqlGenerateResult generateJpql(Pageable pageable,
                                            boolean intercept, boolean distinct) {
        StringBuilder sb = new StringBuilder();
        Map<String, Object> parametersMap = new HashMap<>();
        String select = distinct ? "SELECT DISTINCT " : "SELECT ";
        sb.append(select)
                .append(alias)
                .append(" FROM ")
                .append(entityClass.getSimpleName())
                .append(" ")
                .append(alias);
        if (!joins.isEmpty()) {
            joins.keySet()
                    .forEach((key)
                            -> {
                        sb.append(key.isLeft() ? " LEFT JOIN " : " INNER JOIN ")
                                .append(key.isFetch() ? "FETCH " : "")
                                .append(key.getParent() == null ? alias : key
                                        .getParent())
                                .append(".")
                                .append(key.getField())
                                .append(" ")
                                .append(joins.get(key));
                    });
        }
        if (filter != null && !filter.isEmpty()) {
            sb.append(" WHERE ");
            renderFilter(filter,
                    sb,
                    parametersMap,
                    alias,
                    1);
        }
        if (pageable != null
                && pageable.getSort() != null) {
            for (Order order : pageable.getSort()) {
                sortBy(order.getProperty(),
                        order.getDirection()
                                .isAscending());
            }
        }
     
        if (!sorters.isEmpty()) {
            sb.append(" ORDER BY ");
            Iterator<SortBy> it = sorters.iterator();
            while (it.hasNext()) {
                SortBy sorter = it.next();
                sb.append(alias)
                        .append(".")
                        .append(sorter.getField())
                        .append(" ")
                        .append((sorter.isAscending()) ? "" : " DESC")
                        .append((sorter.isNullsLast()) ? " NULLS LAST" : "");
                if (it.hasNext()) {
                    sb.append(", ");
                }
            }
        }
        String query = sb.toString();
        String countQuery = query.replaceFirst(select + alias + " ",
                "SELECT COUNT(" + (distinct ? "DISTINCT " : "") + alias + ") ")
                .replaceAll("FETCH ",
                        "");

        if (intercept) {
            return new JpqlGenerateResult(intercept(query),
                    countQuery,
                    parametersMap);
        } else {
            return new JpqlGenerateResult(query,
                    countQuery,
                    parametersMap);
        }
    }

    public String getJoinField(String join, String field) {
        return joins.get(new Join(join)) + "." + field;
    }

    SelectQuery<T> addInterceptor(QueryInterceptor interceptor) {
        this.interceptors.add(interceptor);
        return this;
    }

    private String intercept(String query) {
        for (QueryInterceptor interceptor : interceptors) {
            query = interceptor.intercept(query,
                    alias);
        }
        return query;
    }

    private int renderFilter(SelectFilter fb,
                             StringBuilder sb,
                             Map<String, Object> parametersMap,
                             String alias,
                             int parameterIndex) {
        if (fb.getAlias() != null 
                && !fb.getAlias().isEmpty()) {
            alias = fb.getAlias();
        }
        if (filter.isEmpty()) {
            return parameterIndex;
        }
        if (fb.isLeaf()) {
            if (!fb.getOperation()
                    .equalsIgnoreCase("member of")
                    && !fb.getOperation()
                    .equalsIgnoreCase("not member of")) {
                String fieldName = (fb.getField()
                        .contains("."))
                        ? fb.getField()
                        .substring(0,
                                fb.getField()
                                        .indexOf(
                                                "."))
                        : fb.getField();
                Join joinKey = new Join(fieldName);
                if(fb.isIgnoreCase()){
                    sb.append("lower(");
                }
                if (joins.containsKey(joinKey)) {
                    sb.append(joins.get(joinKey));
                    if (fb.getField()
                            .contains(".")) {
                        sb.append(fb.getField()
                                .substring(fb.getField()
                                        .indexOf(".")));
                    }
                } else {
                    sb.append(alias)
                            .append(".")
                            .append(fb.getField());
                }
                if(fb.isIgnoreCase()){
                    sb.append(")");
                }

                //replace equals and not equals with like
                if (fb.getFieldType() != null) {
                    if (fb.getFieldType()
                            .equalsIgnoreCase("string")) {
                        if (fb.getValue() != null
                                && fb.getValue()
                                .toString()
                                .contains("%")) {
                            if (fb.getOperation()
                                    .equals("=")) {
                                fb.setOperation("LIKE");
                            } else if (fb.getOperation()
                                    .equals("<>")) {
                                fb.setOperation("NOT LIKE");
                            }
                        }
                    }
                }
                sb.append(" ")
                        .append(fb.getOperation());
                if (fb.getValue() != null) {
                    String parameterName = "p" + parameterIndex;
                    sb.append(" :")
                            .append(parameterName);
                    if(fb.isIgnoreCase()){
                        parametersMap.put(parameterName,
                                "lower('" + fb.getValue() + "')");
                    } else {
                        parametersMap.put(parameterName,
                                fb.getValue());
                    }
                    return parameterIndex + 1;
                } else if (fb.getValueField() != null) {
                    String valueFieldName = (fb.getValueField()
                            .contains("."))
                            ? fb.getValueField()
                            .substring(0,
                                    fb.getValueField()
                                            .indexOf(
                                                    "."))
                            : fb.getValueField();
                    Join valueJoinKey = new Join(valueFieldName);
                    if (joins.containsKey(valueJoinKey)) {
                        sb.append(joins.get(valueJoinKey));
                        if (fb.getValueField()
                                .contains(".")) {
                            sb.append(fb.getValueField()
                                    .substring(fb.getValueField()
                                            .indexOf(".")));
                        }
                    } else {
                        sb.append(alias)
                                .append(".")
                                .append(fb.getValueField());
                    }
                }
            } else {
                String parameterName = "p" + parameterIndex;
                sb.append(" :")
                        .append(parameterName);
                parametersMap.put(parameterName,
                        fb.getValue());
                parameterIndex++;
                sb.append(" ")
                        .append(fb.getOperation())
                        .append(" ");

                String fieldName = (fb.getField()
                        .contains("."))
                        ? fb.getField()
                        .substring(0,
                                fb.getField()
                                        .indexOf(
                                                "."))
                        : fb.getField();
                Join joinKey = new Join(fieldName);
                if (joins.containsKey(joinKey)) {
                    sb.append(joins.get(joinKey));
                    if (fb.getField()
                            .contains(".")) {
                        sb.append(fb.getField()
                                .substring(fb.getField()
                                        .indexOf(".")));
                    }
                } else {
                    sb.append(alias)
                            .append(".")
                            .append(fb.getField());
                }
                sb.append(" ");
            }
            return parameterIndex;
        } else {
            sb.append(" ( ");
            parameterIndex = renderFilter(fb.getLeft(),
                    sb,
                    parametersMap,
                    alias,
                    parameterIndex);
            if (fb.isAnd()) {
                sb.append(" and ");
            } else {
                sb.append(" or ");
            }
            parameterIndex = renderFilter(fb.getRight(),
                    sb,
                    parametersMap,
                    alias,
                    parameterIndex);
            sb.append(" ) ");
            return parameterIndex;
        }
    }

    protected EntityManager getEntityManager() {
        if (em == null
                || !em.isOpen()) {
            em = Setup.getEntityManagerFactory()
                            .createEntityManager();
        }
        return em;
    }

    protected List<SortBy> getSorters() {
        return sorters;
    }

    protected SelectFilter getFilter() {
        return filter;
    }

    protected Class<T> getEntityClass() {
        return entityClass;
    }

    private static String getAlias(Class<?> entityClass) {
        return entityClass.getSimpleName()
                .charAt(0) + "";
    }

    protected void closeEntityManager() {
        getEntityManager()
                .close();
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    String getAlias() {
        return alias;
    }

	public void setAllowNestedJoinsWithPageable(boolean allowNestedJoinsWithPageable) {
		this.allowNestedJoinsWithPageable = allowNestedJoinsWithPageable;
	}

	private final class ExecutableQuery {

        private final String queryString;
        private final String countQuery;
        private final Map<String, Object> parameters;
        private final boolean cacheResult;

        public ExecutableQuery(String queryString,
                               String countQuery,
                               Map<String, Object> parameters, boolean cacheResult) {
            this.queryString = queryString;
            this.countQuery = countQuery;
            this.parameters = parameters;
            this.cacheResult = cacheResult;
        }

        public String getQueryString() {
            return queryString;
        }

        public String getCountQuery() {
            return countQuery;
        }

        public Map<String, Object> getParameters() {
            return parameters;
        }

        private TypedQuery<T> createQuery() {
            TypedQuery<T> query = getEntityManager()
                    .createQuery(this.queryString,
                            entityClass);
            setParameters(query);
            return query;
        }

        private long getCount() {
            if (queryCountValue == null) {
                Query countQuery = getEntityManager()
                        .createQuery(
                                this.countQuery);
                setParameters(countQuery);
                queryCountValue = ((Number) countQuery
                        .getSingleResult()).longValue();
            }
            return queryCountValue;
        }

        private void setParameters(Query query) {
            if (parameters != null) {
                parameters.keySet()
                        .forEach((key)
                                -> {
                            query.setParameter(key,
                                    parameters.get(key));
                        });
            }
        }

        public List<T> execute() {
            
            TypedQuery<T> query = createQuery();
            if (limit != null) {
                query.setMaxResults(limit);
            }
            if (cacheResult) {
                query.setHint("org.hibernate.cacheable",
                        true);
            }
            return query.getResultList();
        }

        public Page<T> execute(Pageable pageable) {
          
            TypedQuery<T> query = createQuery();
            query.setFirstResult(pageable.getPageNumber() * pageable
                    .getPageSize());
            query.setMaxResults(pageable.getPageSize());
            if (cacheResult) {
                query.setHint("org.hibernate.cacheable",
                        true);
            }
            return new PageImpl<>(query.getResultList(),
                    pageable,
                    withTotalCount ? getCount() : 0L);
        }

        public Number executeScalar() {
           
            Query query = getEntityManager()
                    .createQuery(
                            this.queryString);
            setParameters(query);
            if (cacheResult) {
                query.setHint("org.hibernate.cacheable",
                        true);
            }
            Number result = (Number) query.getSingleResult();
            return result != null ? result : 0;
        }

        private void printQuery() {
            logger.info("Executed Query:");
            logger.info(queryString);
            logger.info("Executed count Query:");
            logger.info(countQuery);
            logger.info("Parameters:");
            parameters.forEach((k, v)
                    -> {
                logger.log(Level.INFO,
                        "{0} = {1}",
                        new Object[]{k, v});
            });
        }

        public Date executeScalarDate() {
            
            Query query = getEntityManager()
                    .createQuery(
                            this.queryString);
            setParameters(query);
            return (Date) query.getSingleResult();
        }
    }

    static final class JpqlGenerateResult {

        private final String query;
        private final String countQuery;
        private final Map<String, Object> parametersMap;

        public JpqlGenerateResult(String query,
                                  String countQuery,
                                  Map<String, Object> parametersMap) {
            this.query = query;
            this.countQuery = countQuery;
            this.parametersMap = parametersMap;
        }

        public String getQuery() {
            return query;
        }

        public Map<String, Object> getParametersMap() {
            return parametersMap;
        }

        public String getCountQuery() {
            return countQuery;
        }
    }

    protected static final class SortBy {

        private final String field;
        private final boolean ascending;
        private final boolean nullsLast;

        public SortBy(String field,
                      boolean ascending) {
            this.field = field;
            this.ascending = ascending;
            this.nullsLast = false;
        }

        public SortBy(String field,
                      boolean ascending,
                      boolean nullsLast) {
            this.field = field;
            this.ascending = ascending;
            this.nullsLast = nullsLast;
        }

        public String getField() {
            return field;
        }

        public boolean isAscending() {
            return ascending;
        }

        public boolean isNullsLast() {
            return nullsLast;
        }
    }

    abstract static class QueryInterceptor {

        public abstract String intercept(String query,
                                         String alias);
    }

    private class Join {

        private String field;
        private boolean left = false;
        private boolean fetch = false;
        private String parent = null;

        public Join(String field) {
            this.field = field;
        }

        public Join(String field, boolean left) {
            this.field = field;
            this.left = left;
        }

        public Join(String field, boolean left, boolean fetch) {
            this.field = field;
            this.left = left;
            this.fetch = fetch;
        }

        public Join(String parent, String field, boolean left) {
            this.parent = parent;
            this.field = field;
            this.left = left;
            this.fetch = true;
        }

        public String getParent() {
            return parent;
        }

        public String getField() {
            return field;
        }

        public boolean isLeft() {
            return left;
        }

        @Override
        public int hashCode() {
            return field.hashCode() + (parent != null ? parent.hashCode() : 0);
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj) {
                return true;
            }
            if (obj == null) {
                return false;
            }
            if (getClass() != obj.getClass()) {
                return false;
            }
            final Join other = (Join) obj;
            return Objects.equals(this.field,
                    other.field)
                    && Objects.equals(this.parent,
                    other.parent);
        }

        public boolean isFetch() {
            return fetch;
        }
    }

    @Lock(LockModeType.READ)
    public static ResultSet executeNative(String queryString,
                                          Pageable pageable) {
        if (!isReadOnlyNativeQuery(queryString)) {
            throw new RuntimeException("The query contains DML statements");
        }
        try {
            EntityManager em = Setup.getEntityManagerFactory()
                    .createEntityManager();
            Connection connection = em.unwrap(SessionImpl.class)
                    .connection();
            Statement statement = connection.createStatement(
                    ResultSet.TYPE_SCROLL_SENSITIVE,
                    ResultSet.CONCUR_READ_ONLY);
            return statement.executeQuery(queryString
                    + " Limit "
                    + pageable.getPageNumber()
                    * pageable.getPageSize()
                    + ", "
                    + pageable.getPageSize());
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    @Lock(LockModeType.READ)
    public static ResultSet executeNative(String queryString) {
        if (!isReadOnlyNativeQuery(queryString)) {
            throw new RuntimeException("The query contains DML statements");
        }
        try {
            EntityManager em = Setup.getEntityManagerFactory()
                    .createEntityManager();
            Connection connection = em.unwrap(SessionImpl.class)
                    .connection();
            Statement statement = connection.createStatement(
                    ResultSet.TYPE_SCROLL_SENSITIVE,
                    ResultSet.CONCUR_READ_ONLY);
            return statement.executeQuery(queryString);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public static boolean isReadOnlyNativeQuery(String quary) {
        String regex = "(INSERT\\sINTO\\s)|(UPDATE\\s[\\w]+\\sSET\\s)|(DELETE\\sFROM\\\\s)";
        Pattern re = Pattern.compile(regex,
                Pattern.CASE_INSENSITIVE);
        Matcher m = re.matcher(quary);
        return !m.find();
    }

}
