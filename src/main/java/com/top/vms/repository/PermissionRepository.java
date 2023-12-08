/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.repository;

import com.top.vms.entity.Endpoint;
import com.top.vms.entity.Permission;
import com.top.vms.entity.Role;
import com.top.vms.entity.User;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @author Ahmad
 */

@Repository
public interface PermissionRepository extends BaseRepository<Permission> {

    public List<Permission> findByEndpoint(Endpoint endpoint);

    public List<Permission> findByRoleIn(List<Role> roles);

    public Permission findOneByEndpointAndRoleIn(Endpoint endpoint, List<Role> roles);

}
