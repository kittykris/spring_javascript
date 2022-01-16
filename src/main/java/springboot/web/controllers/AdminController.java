package springboot.web.controllers;

import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.Set;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final String redirect = "redirect:/admin";

    private UserService userService;
    private RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping
    public String usersList(Model model) {
        model.addAttribute("userList", userService.userList());
        model.addAttribute("allRoles", roleService.allRoles());
        return "users";
    }

    @PostMapping("/save")
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

    @RequestMapping(value="/update", method = {RequestMethod.PATCH, RequestMethod.GET})
    public String updateUser(@PathVariable("id") long id,
                              @Valid User user) {
//                             BindingResult result,
//                             Model model) {
        if (!userService.isUsernameUnique(user.getUsername())) {
            if (userService.getUserById(id).getUsername().equals(user.getUsername())) {
//                if (user.getRoles().isEmpty()) {
//                    addErrorIfExistsForField(result, model, "roles", "Role must be not empty");
//                    return "updateUser";
//                }
                userService.updateUserWithoutUsername(id, user);
                return redirect;
            }
        }
//            addErrorIfExistsForField(result, model, "username", "User is already exists");
//        }
//        if (user.getRoles().isEmpty()) {
//            addErrorIfExistsForField(result, model, "roles", "Role must be not empty");
//        }
//        if (result.hasErrors()) {
//            return "updateUser";
//        }
        userService.updateUser(id, user);
        return redirect;
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return redirect;
    }

    @RequestMapping("/getuser")
    @ResponseBody
    public User getUser(Long id) {
        return userService.getUserById(id);
    }

    private void addErrorIfExistsForField(BindingResult result, Model model, String fieldName, String defaultMessage) {
        result.addError(new FieldError(fieldName, fieldName, defaultMessage));
        model.addAttribute("allRoles", roleService.allRoles());
    }

}
