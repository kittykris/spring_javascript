package springboot.web.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import springboot.web.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {

    void addUser(User user);

    User getUserById(long id);

    void updateUser(long id, User user);

    void updateUserWithoutUsername(long id, User user);

    void deleteUser(long id);

    List<User> userList();

    boolean isUsernameUnique(String userName);

    void addDefaultUsers();
}
