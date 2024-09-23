/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.lcd.repository;

import com.top.lcd.entity.Endpoint;
import com.top.lcd.entity.Permission;
import com.top.lcd.entity.Role;
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
