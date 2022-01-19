package springboot.web.dao;

import org.springframework.stereotype.Repository;
import springboot.web.model.User;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public class UserDaoImp implements UserDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void addUser(User user) {
        entityManager.persist(user);
    }

    @Override
    public User getUserById(long id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public void updateUser(long id, User user) {
        user.setId(id);
        entityManager.merge(user);
    }

    @Override
    public void deleteUser(long id) {
        entityManager.remove(entityManager.find(User.class, id));
    }

    @Override
    public List<User> userList() {
        return entityManager.createQuery("SELECT users from User users", User.class)
                .getResultList();
    }

    @Override
    public User getUserByLogin(String login) {
        User user;
        try {
            user = entityManager
                    .createQuery("select u from User u where u.email =: userName", User.class)
                    .setParameter("userName", login).getSingleResult();
        } catch (NoResultException nre) {
            user = null;
        }
        return user;
    }
}
