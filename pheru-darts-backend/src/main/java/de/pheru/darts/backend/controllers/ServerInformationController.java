package de.pheru.darts.backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/serverInformation")
public class ServerInformationController {

    private final String appVersion;

    public ServerInformationController(@Value("${app.version}") final String appVersion) {
        this.appVersion = appVersion;
    }

    @GetMapping
    public String publicInformation() {
        return appVersion;
    }

}
