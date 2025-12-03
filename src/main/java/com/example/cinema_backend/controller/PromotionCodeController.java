package com.example.cinema_backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.cinema_backend.repository.PromotionCodeRepository;
import com.example.cinema_backend.repository.UserRepository;
import com.example.cinema_backend.model.PromotionCode;
import com.example.cinema_backend.model.User;
import com.example.cinema_backend.service.EmailService;
import com.example.cinema_backend.model.Promotion;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "http://localhost:3000")
public class PromotionCodeController {

    @Autowired
    private PromotionCodeRepository promotionCodeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<PromotionCode> getAllPromotionCodes() {
        return promotionCodeRepository.findAll();
    }

    // Add promotion + send emails
    @PostMapping
    public PromotionCode addPromotion(@RequestBody PromotionCode promo) {
        promo.setState("Active");
        PromotionCode savedPromo = promotionCodeRepository.save(promo);

        // Send emails to opted-in users
        List<User> users = userRepository.findByPromotion(Promotion.REGISTERED);
        for (User user : users) {

            try {
                emailService.sendEmail(user.getEmail(), savedPromo);
            } catch (Exception e) {
                System.err.println("Failed to send promotion to " + user.getEmail());
                e.printStackTrace();
            }
        }

        return savedPromo;
    }

    @DeleteMapping("/{id}")
    public String deletePromotion(@PathVariable String id) {
        Optional<PromotionCode> promoOpt = promotionCodeRepository.findById(id);
        if (!promoOpt.isPresent()) {
            return "Promotion not found";
        }
        promotionCodeRepository.deleteById(id);
        return "Promotion deleted successfully";
    }

    @PostMapping("/send/{id}")
    public String sendPromotion(@PathVariable String id) {
        Optional<PromotionCode> promoOpt = promotionCodeRepository.findById(id);
        if (!promoOpt.isPresent()) {
            return "Promotion not found";
        }

        PromotionCode promo = promoOpt.get();
        List<User> users = userRepository.findByPromotion(Promotion.REGISTERED);
        int sentCount = 0;

        for (User user : users) {

            try {
                emailService.sendEmail(user.getEmail(), promo);
                sentCount++;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return "Promotion sent to " + sentCount + " registered users";
    }

    // Test email endpoint (optional)
    @GetMapping("/test-email")
    public String testEmail() {
        emailService.sendEmail("samruddhi020202@gmail.com", "Test Email", "This is a test.");
        return "Email sent (if configuration is correct)";
    }
}