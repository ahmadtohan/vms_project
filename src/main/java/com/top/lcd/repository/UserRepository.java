/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.lcd.repository;

import com.top.lcd.entity.Endpoint;
import com.top.lcd.entity.User;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @author Ahmad
 */

@Repository
public interface UserRepository extends BaseRepository<User> {

    public User findByUsername(String username);

    public List<User> findByTypeAndStatus(User.Type type, User.Status status);

}
