package com.top.vms.repository;

import com.top.vms.entity.BaseEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.history.RevisionRepository;
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
