package ru.malinki.portfolio.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.malinki.portfolio.models.Work; // Исправлено на Work
import ru.malinki.portfolio.repo.WorkRepository; // Исправлено на WorkRepository
import java.util.List;

@Controller
public class WorksController {

    private final WorkRepository workRepository;

    public WorksController(WorkRepository workRepository) {
        this.workRepository = workRepository;
    }

    @GetMapping("/works")
    public String works(Model model) {
        List<Work> works = (List<Work>) workRepository.findAll();
        System.out.println(works.size());
        model.addAttribute("works", works);
        return "works";
    }
}



