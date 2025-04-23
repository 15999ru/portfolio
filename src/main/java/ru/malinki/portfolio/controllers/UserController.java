package ru.malinki.portfolio.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.malinki.portfolio.models.User;
import ru.malinki.portfolio.repo.UserRepository;
import ru.malinki.portfolio.PasswordHasher;


import java.net.HttpCookie;
import java.util.Objects;

import static java.lang.System.out;

@Controller
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

//    @GetMapping("/error")
//    public String error(String res, String text, Model model) {
//        model.addAttribute("res", res);
//        model.addAttribute("text", text);
//        return "error";
//    }

    @GetMapping("/login")
    public String login(Model model){
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String logmail, @RequestParam String logpass, Model model){

        for(User el: userRepository.findAll()){
            if(Objects.equals(el.getEmail(), logmail)) {
                if (PasswordHasher.checkPassword(logpass, el.getPassword())) {
                    return "redirect:/";
                }
            }
        }
        return "error";

    }
    @GetMapping("/reg")
    public String reg(Model model){
        return "reg";
    }


    @PostMapping("/reg")
    public String auth(@RequestParam String regname, @RequestParam String regmail, @RequestParam String regpass, Model model){

        for(User el: userRepository.findAll()){
            if(Objects.equals(el.getEmail(), regmail)) {
//                error("Ошибка почты", "Данная почта уже занята", model);
                return "error";
            }
        }
        regpass = PasswordHasher.hashPassword(regpass);
        User user = new User(regname, regpass, regmail);
        userRepository.save(user);
        return "redirect:/login";
    }

}
