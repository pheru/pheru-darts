package de.pheru.darts.backend;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
public class TestController {

    @RequestMapping("/testfehler")
    public User testfehler() {
        System.out.println("Testfehler aufgerufen");
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("return Exception mit message \"Ich bin ein Fehler\"");
        throw new RuntimeException("Ich bin ein Fehler");
    }
}
