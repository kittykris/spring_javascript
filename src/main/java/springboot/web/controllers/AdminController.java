package springboot.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import springboot.web.model.User;
import springboot.web.service.RoleService;

import java.security.Principal;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final RoleService roleService;

    @Autowired
    public AdminController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public String adminDetails(Model model, Principal principal) {
        User loginedUser = (User) ((Authentication) principal).getPrincipal();
        model.addAttribute("adminDetails", loginedUser);
        model.addAttribute("allRoles", roleService.allRoles());
        return "adminDetails";
    }
}
