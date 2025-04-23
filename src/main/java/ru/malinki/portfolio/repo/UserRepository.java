package ru.malinki.portfolio.repo;

import org.springframework.data.repository.CrudRepository;
import ru.malinki.portfolio.models.User;

public interface UserRepository extends CrudRepository<User, Long> {
}