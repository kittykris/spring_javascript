package springboot.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import springboot.web.model.User;
import springboot.web.service.RoleService;
import springboot.web.service.UserService;

import java.security.Principal;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final String redirect = "redirect:/admin";

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping
    public String adminDetails(Model model, Principal principal) {
        User loginedUser = (User) ((Authentication) principal).getPrincipal();
        model.addAttribute("adminDetails", loginedUser);
        return "adminDetails";
    }

    @PostMapping("/save")
    public String addNewUser(User user) {
        if (!userService.isUsernameUnique(user.getUsername())) {
            return redirect;
        }
        userService.addUser(user);
        return redirect;
    }

    @GetMapping("/edit/{id}")
    public String showEditModal(@PathVariable("id") long id, Model model) {
        model.addAttribute("updateUser", userService.getUserById(id));
        model.addAttribute("allRoles", roleService.allRoles());
        return "updateUserModal";
    }

    @PatchMapping("/{id}")
    public String updateUser(@PathVariable("id") long id,
                             @ModelAttribute("updateUser") User user) {
        if (!userService.isUsernameUnique(user.getUsername())) {
            return redirect;
        }
        if (user.getPassword().isEmpty()) {
            user.setPassword(userService.getUserById(id).getPassword());
        }
        user.setId(id);
        userService.updateUser(user);
        return redirect;
    }

    @GetMapping("/delete/{id}")
    public String showDeleteModal(@PathVariable("id") long id, Model model) {
        model.addAttribute("deleteUser", userService.getUserById(id));
        model.addAttribute("allRoles", roleService.allRoles());
        return "deleteUserModal";
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return redirect;
    }

    @ModelAttribute
    public void usersList(Model model) {
        model.addAttribute("userList", userService.userList());
        model.addAttribute("newUser", new User());
        model.addAttribute("allRoles", roleService.allRoles());
    }
}
