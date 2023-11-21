/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.top.vms.repository;

import com.top.vms.entity.Attachment;
import com.top.vms.entity.User;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Ahmad
 */

@Repository
public interface AttachmentRepository extends BaseRepository<Attachment> {

 public List<Attachment> findByEntityIdAndEntityType(Long EntityId, String EntityType);

 public Attachment findByEntityIdAndEntityTypeAndType(Long EntityId, String EntityType, String type);

  public Attachment findByName(String name);

}
