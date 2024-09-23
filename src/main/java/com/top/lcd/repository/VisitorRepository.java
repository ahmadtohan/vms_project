/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.lcd.repository;

import com.top.lcd.entity.Visitor;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Ahmad
 */

@Repository
public interface VisitorRepository extends BaseRepository<Visitor> {

    public Visitor findByAccessKey(String accessKey);

}
