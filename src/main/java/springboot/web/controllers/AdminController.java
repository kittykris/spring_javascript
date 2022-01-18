package springboot.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import springboot.web.model.Role;
import springboot.web.model.User;
import springboot.web.service.RoleService;
import springboot.web.service.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Set;

@Controller
public class AdminController {

    private final String redirect = "redirect:/admin";

    private UserService userService;
    private RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostMapping("/admin/save")
    public String addNewUser(@Valid User user) {
//                             BindingResult result,
//                             Model model) {
//        if (!userService.isUsernameUnique(user.getUsername())) {
//            addErrorIfExistsForField(result, model, "username", "User is already exists");
//        }
//        if (user.getRoles().isEmpty()) {
//            addErrorIfExistsForField(result, model, "roles", "Role must be not empty");
//        }
//        if (result.hasErrors()) {
//            return "addUser";
//        }
        userService.addUser(user);
        return redirect;
    }

    @GetMapping("/admin/edit/{id}")
    public String showEditModal(@PathVariable("id") long id, Model model) {
        model.addAttribute("updateUser", userService.getUserById(id));
        model.addAttribute("allRoles", roleService.allRoles());
        return "updateUserModal";
    }

    @PatchMapping("/admin/{id}")
    public String updateUser(@PathVariable("id") long id,
                             @ModelAttribute("updateUser") @Valid User user,
                             BindingResult result,
                             Model model) {
        if (!userService.isUsernameUnique(user.getUsername())) {
            if (userService.getUserById(id).getUsername().equals(user.getUsername())) {
                if (user.getRoles().isEmpty()) {
                    addErrorIfExistsForField(result, model, "roles", "Role must be not empty");
                    return "updateUserModal";
                }
                userService.updateUserWithoutUsername(id, user);
                return redirect;
            }
            addErrorIfExistsForField(result, model, "username", "User is already exists");
        }
        if (user.getRoles().isEmpty()) {
            addErrorIfExistsForField(result, model, "roles", "Role must be not empty");
        }
        if (result.hasErrors()) {
            return "updateUserModal";
        }
        userService.updateUser(id, user);
        return redirect;
    }

    @GetMapping("/admin/delete/{id}")
    public String showDeleteModal(@PathVariable("id") long id, Model model) {
        model.addAttribute("deleteUser", userService.getUserById(id));
        model.addAttribute("allRoles", roleService.allRoles());
        return "deleteUserModal";
    }

    @DeleteMapping("/admin/{id}")
    public String deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return redirect;
    }

    private void addErrorIfExistsForField(BindingResult result, Model model, String fieldName, String defaultMessage) {
        result.addError(new FieldError(fieldName, fieldName, defaultMessage));
        model.addAttribute("allRoles", roleService.allRoles());
    }

}
