package com.example.cinema_backend.runner;
import com.example.cinema_backend.model.Customer;
import com.example.cinema_backend.model.PaymentInfo;
import com.example.cinema_backend.repository.CustomerRepository;
import com.example.cinema_backend.security.AESUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// @Component
// public class EncryptExistingCardRunner implements CommandLineRunner {

//     // @Autowired
//     // private CustomerRepository customerRepository;

//     // @Override
//     // public void run(String... args) throws Exception {
//     //     for (Customer customer : customerRepository.findAll()) {
//     //         if (customer.getPaymentInfo() != null) {
//     //             for (PaymentInfo p : customer.getPaymentInfo()) {
//     //                 if (p.getCardNumber() != null && !p.getCardNumber().isEmpty()) {
//     //                     p.setCardNumber(AESUtil.encrypt(p.getCardNumber()));
//     //                 }
//     //                 if (p.getCvv() != null && !p.getCvv().isEmpty()) {
//     //                     p.setCvv(AESUtil.encrypt(p.getCvv()));
//     //                 }
//     //             }
//     //             customerRepository.save(customer);
//     //             System.out.println("Encrypted payment info for customer: " + customer.getEmail());
//     //         }
//     //     }
//     // }
// }
