package com.top.lcd.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

/**
 *
 *
 */
@NoRepositoryBean
public abstract interface BaseRepositoryParent<T>
        extends JpaRepository<T, Long> {

    public default T findOne(Long id) {
        return findById(id)
                .orElse(null);
    }

    public default <S extends T> List<S> save(Iterable<S> entities) {
        return saveAll(entities);
    }

    public default T silentSave(T entity) {
        return save(entity);
    }

    public default <S extends T> S saveWithFlush(S entity) {
        return saveAndFlush(entity);
    }

    public default <S extends T> List<S> saveAndIgnoreDuplication(Iterable<S> entities) {
        List<S> saved = new ArrayList<>();
        entities.forEach(entity -> {
            try {
                saved.add(save(entity));
            } catch (DataIntegrityViolationException ex) {
                // ignore reapeated entity
            }
        });
        return saved;
    }

    public default void delete(Iterable<? extends T> entities) {
        deleteAll(entities);
    }

    public default void delete(Long id) {
        deleteById(id);
    }

    public default List<T> findAll(Iterable<Long> ids) {
        return findAllById(ids);
    }

    public default boolean exists(Long id) {
        return existsById(id);
    }
}
