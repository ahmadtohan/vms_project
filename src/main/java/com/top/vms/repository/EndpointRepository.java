/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.repository;

import com.top.vms.entity.Endpoint;
import com.top.vms.entity.Role;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @author Ahmad
 */

@Repository
public interface EndpointRepository extends BaseRepository<Endpoint> {

    public Endpoint findByApi(String api);

}
