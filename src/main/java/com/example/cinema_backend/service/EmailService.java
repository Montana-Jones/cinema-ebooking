package com.example.cinema_backend.service;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.cinema_backend.model.PromotionCode;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("nguyenuy1509@gmail.com"); // change to your sender email
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    public void sendEmail(String to, PromotionCode promo) {
        String subject = "🎉 New Promotion Available!";
        String text = "Hello!\n\nYou received a new promotion:\n\n" +
                "Code: " + promo.getCode() + "\n" +
                "Discount: " + promo.getAmount() + "%\n\n" +
                "Use it soon!\n\n" +
                "🍿 Cinema Booking Team";

        // Call the original sendEmail() to send the message
        sendEmail(to, subject, text);
    }

    public String sendVerificationEmail(String toEmail) {
        String code = generateVerificationCode();

        String subject = "Cinema Booking Verification Code";
        String text = "Your verification code is: " + code;

        sendEmail(toEmail, subject, text); // reuse existing sendEmail method
        System.out.println("Sent verification code " + code + " to " + toEmail);
        return code; // return the code so you can save it to Customer
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 6-digit code
        return String.valueOf(code);
    }

    public void sendPasswordReset(String toEmail, String resetLink) {
        String subject = "Cinema Booking Password Reset";
        String text = "You requested a password reset.\n\n"
                + "Click the link below to reset your password:\n"
                + resetLink + "\n\n"
                + "If you did not request this, please ignore this email.";

        try {
            sendEmail(toEmail, subject, text);
            System.out.println("Sent password reset link to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email to " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Failed to send reset email");
        }
    }

}