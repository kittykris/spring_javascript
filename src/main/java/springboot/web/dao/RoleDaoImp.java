package springboot.web.dao;

import org.springframework.stereotype.Repository;
import springboot.web.model.Role;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.Set;

@Repository
@Transactional
public class RoleDaoImp implements RoleDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Set<Role> allRoles() {
        return new HashSet<>(entityManager
                .createQuery("SELECT role from Role role", Role.class)
                .getResultList());
    }

    @Override
    public Role findRoleByName(String roleName) {
        return entityManager.createQuery("select r from Role r where r.name =: roleName", Role.class)
                .setParameter("roleName", roleName).getSingleResult();
    }

    @Override
    public void addRole(Role role) {
        if (!entityManager.contains(role)) {
            entityManager.persist(role);
        }
    }

    @Override
    public void deleteRole(Role role) {
        if (entityManager.contains(role)) {
            entityManager.remove(role);
        }
    }
}
