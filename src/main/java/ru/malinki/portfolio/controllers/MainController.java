package ru.malinki.portfolio.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.malinki.portfolio.models.User;

@Controller
public class MainController {

    @GetMapping("/")
    public String index(Model model){

        model.addAttribute("title", "Главная");
        return "index";
    }






}