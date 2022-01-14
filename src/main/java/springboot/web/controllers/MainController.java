package springboot.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import springboot.web.service.RoleService;
import springboot.web.service.UserService;

@Controller
public class MainController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public MainController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
        this.roleService.addDefaultRoles();
        this.userService.addDefaultUsers();
    }

    @GetMapping("/")
    public String home() {
        return "redirect:/login";
    }
}
