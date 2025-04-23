package ru.malinki.portfolio.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ru.malinki.portfolio.models.Work;
import ru.malinki.portfolio.repo.WorkRepository;

import java.util.List;

@RestController
public class WorksApiController {

    private final WorkRepository workRepository;

    public WorksApiController(WorkRepository workRepository) {
        this.workRepository = workRepository;
    }

    @GetMapping("/api/works")
    public List<Work> getAllWorks() {
        return (List<Work>) workRepository.findAll();
    }

    @GetMapping("/api/works/{id}")
    public Work getWorkById(@PathVariable Long id) {
        return workRepository.findById(id).orElse(null);
    }
}
