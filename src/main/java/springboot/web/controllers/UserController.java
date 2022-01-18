package springboot.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import springboot.web.model.User;
import springboot.web.service.RoleService;
import springboot.web.service.UserService;

import java.security.Principal;

@Controller
public class UserController {

    private UserService userService;
    private RoleService roleService;

    @Autowired
    public UserController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping(value = {"/user", "/admin"})
    public String userDetails(Model model, Principal principal) {
        User loginedUser = (User) ((Authentication) principal).getPrincipal();
        model.addAttribute("userDetails", loginedUser);
        return "userDetails";
    }

    @ModelAttribute
    public void usersList(Model model) {
        model.addAttribute("userList", userService.userList());
    }

    @ModelAttribute
    public void viewNewUser(Model model) {
        model.addAttribute("newUser", new User());
        model.addAttribute("allRoles", roleService.allRoles());
    }
}