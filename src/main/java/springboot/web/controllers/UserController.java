package springboot.web.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import springboot.web.model.User;

import java.security.Principal;

@Controller
public class UserController {

	@GetMapping(value = {"/user", "/admin"})
	public String userDetails(Model model, Principal principal) {
		User loginedUser = (User) ((Authentication) principal).getPrincipal();
		model.addAttribute("userDetails", loginedUser);
		return "userDetails";
	}
}