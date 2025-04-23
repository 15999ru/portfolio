package ru.malinki.portfolio.repo;

import org.springframework.data.repository.CrudRepository;
import ru.malinki.portfolio.models.Work;

public interface WorkRepository extends CrudRepository<Work, Long> {
}