package springboot.web.service;

import springboot.web.model.Role;
import springboot.web.model.User;

import java.util.Set;

public interface RoleService {

    Set<Role> allRoles();

    Role findRoleByName(String roleName);

    Set<Role> existingRoles(User user);

    void addDefaultRoles();
}
