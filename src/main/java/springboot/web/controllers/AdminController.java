package springboot.web.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import springboot.web.model.User;

import java.security.Principal;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @GetMapping
    public String adminDetails(Model model, Principal principal) {
        User loginedUser = (User) ((Authentication) principal).getPrincipal();
        model.addAttribute("adminDetails", loginedUser);
        return "adminDetails";
    }
}
