/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.repository;

import com.top.vms.entity.User;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Ahmad
 */

@Repository
public interface UserRepository extends BaseRepository<User> {

    public User findByUsername(String username);

}
