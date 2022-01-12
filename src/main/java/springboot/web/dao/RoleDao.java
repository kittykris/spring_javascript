package springboot.web.dao;

import springboot.web.model.Role;

import java.util.Set;

public interface RoleDao {

    Set<Role> allRoles();

    Role findRoleByName(String roleName);

    void addRole(Role role);

    void deleteRole(Role role);
}
