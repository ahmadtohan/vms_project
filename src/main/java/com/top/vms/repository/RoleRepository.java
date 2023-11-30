
package com.top.vms.repository;

import com.top.vms.entity.Role;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @author Ahmad
 */

@Repository
public interface RoleRepository extends BaseRepository<Role> {

    public Role findByName(String name);

    public List<Role> findByStatus(Role.Status status);
}
