package springboot.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import springboot.web.dao.UserDao;
import springboot.web.model.Role;
import springboot.web.model.User;

import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class UserServiceImp implements UserService {

    private UserDao userDao;
    private RoleService roleService;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    @Autowired
    public UserServiceImp(UserDao userDao, RoleService roleService) {
        this.userDao = userDao;
        this.roleService = roleService;
    }

    @Override
    public void addUser(User user) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(roleService.existingRoles(user));
        userDao.addUser(user);
    }

    @Override
    public User getUserById(long id) {
        return userDao.getUserById(id);
    }

    @Override
    public void updateUser(User user) {
        user.setRoles(roleService.existingRoles(user));
        userDao.updateUser(user);
    }

    @Override
    public void deleteUser(long id) {
        userDao.deleteUser(id);
    }

    @Override
    public List<User> userList() {
        return userDao.userList();
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userDao.getUserByLogin(email);
        if (user == null) {
            throw new UsernameNotFoundException("There no user with this username found");
        }
        return user;
    }

    @Override
    public boolean isUsernameUnique(String email) {
        boolean unique = true;
        if (userDao.getUserByLogin(email) != null) {
            unique = false;
        }
        return unique;
    }

    @Override
    public void addDefaultUsers() {
        User user = new User("user", "user", (byte) 25, "user", passwordEncoder.encode("user"));
        Set<Role> userSet = new HashSet<>();
        userSet.add(roleService.findRoleByName("USER"));
        user.setRoles(userSet);
        userDao.addUser(user);
        User admin = new User("admin", "admin", (byte) 25, "admin", passwordEncoder.encode("admin"));
        Set<Role> adminSet = new HashSet<>();
        adminSet.add(roleService.findRoleByName("ADMIN"));
        adminSet.add(roleService.findRoleByName("USER"));
        admin.setRoles(adminSet);
        userDao.addUser(admin);
    }
}
