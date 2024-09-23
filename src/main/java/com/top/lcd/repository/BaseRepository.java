package com.top.lcd.repository;

import com.top.lcd.entity.BaseEntity;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 *
 * @author 
 * Created on Jun 20, 2017
 * @param <T>
 */
@NoRepositoryBean
@RepositoryRestResource(exported = false)
public abstract interface BaseRepository<T extends BaseEntity>
        extends BaseRepositoryParent<T> {

}
