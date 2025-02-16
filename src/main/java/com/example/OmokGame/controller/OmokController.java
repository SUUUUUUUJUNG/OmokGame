package com.example.OmokGame.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class OmokController {

    @GetMapping("/")
    public String index(Model model) {
        return "index"; // templates/index.html로 이동
    }

}
