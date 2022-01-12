package springboot.web.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;

@Controller
public class MainController {

    @GetMapping("/")
    public String home() {
        return "redirect:/login";
    }


    @GetMapping("/403")
    public String getAccessDenied(Model model, Principal principal) {
        if (principal != null) {
            model.addAttribute("msg", "Hi " + principal.getName()
                    + "! Sorry, but you do not have permission to access this page!");
        } else {
            model.addAttribute("msg",
                    "Sorry, but You do not have permission to access this page!");
        }
        return "/403";
    }
}
