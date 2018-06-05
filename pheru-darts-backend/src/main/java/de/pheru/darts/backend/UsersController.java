package de.pheru.darts.backend;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
public class UsersController {

    private static final Logger LOGGER = new Logger();

    private static final List<User> users = new ArrayList<>();
    private static int idCounter = 1;

    public UsersController() {
        users.add(new User(1, "Philipp"));
        users.add(new User(2, "Patrick"));
        users.add(new User(3, "Michael"));
        users.add(new User(4, "Heiko"));
        idCounter = 5;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        LOGGER.debug("GET auf /users aufgerufen");
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        LOGGER.debug("GET auf /users: " + users.size() + " User");
        return users;
    }

    @PostMapping("/users")
    public User addUser(@RequestBody final User user) {
        LOGGER.debug("POST auf /users aufgerufen");
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        for (User u : users) {
            if (u.getName().equals(user.getName())) {
                throw new RuntimeException("Name \"" + u.getName() + "\" bereits vergeben!");
            }
        }
        user.setId(idCounter);
        idCounter++;
        users.add(user);
        LOGGER.debug("POST auf /users: User erfolgreich angelegt");
        return user;
    }

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable("id") final long id) {
        LOGGER.debug("GET auf /users aufgerufen: id=" + id);
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        LOGGER.debug("GET auf /users: User mit id " + id + "  gefunden");
        return users.get((int) id);
    }


    @PutMapping("/users/{id}")
    public User putUser(@PathVariable("id") final long id, @RequestBody final User user) {
        LOGGER.debug("PUT auf /users aufgerufen: id=" + id);
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        LOGGER.debug("PUT auf /users aufgerufen: User mit id " + id + "  erfolgreich angepasst");
        return user;
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable("id") final long id) {
        LOGGER.debug("DELETE auf /users aufgerufen: id=" + id);
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        LOGGER.debug("DELETE auf /users aufgerufen: User mit id " + id + " erfolgreich gelöscht");
    }

}
