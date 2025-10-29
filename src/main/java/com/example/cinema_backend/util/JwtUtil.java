package com.example.cinema_backend.util;

import org.springframework.stereotype.Component;
import java.util.Base64;
import java.nio.charset.StandardCharsets;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Component
public class JwtUtil {
    // Replace this secret with a securely generated random value and keep it out of source code (e.g., env var)
    private static final String SECRET = "replace_with_a_secure_random_key_of_sufficient_length";
    private static final long EXPIRATION_TIME = 86400000; // 1 day

    public String generateToken(String email) {
        long now = System.currentTimeMillis();
        long exp = now + EXPIRATION_TIME;
        String headerJson = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        String payloadJson = String.format("{\"sub\":\"%s\",\"iat\":%d,\"exp\":%d}", escapeJson(email), now / 1000, exp / 1000);

        String header = base64UrlEncode(headerJson.getBytes(StandardCharsets.UTF_8));
        String payload = base64UrlEncode(payloadJson.getBytes(StandardCharsets.UTF_8));
        String signingInput = header + "." + payload;
        String signature = base64UrlEncode(hmacSha256(signingInput.getBytes(StandardCharsets.UTF_8), SECRET.getBytes(StandardCharsets.UTF_8)));

        return signingInput + "." + signature;
    }

    public String extractEmail(String token) {
        if (token == null) return null;
        String[] parts = token.split("\\.");
        if (parts.length != 3) return null;
        String payloadJson;
        try {
            payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            return null;
        }
        // simple parsing to extract "sub" value without external JSON libs
        String key = "\"sub\"";
        int idx = payloadJson.indexOf(key);
        if (idx == -1) return null;
        int colon = payloadJson.indexOf(':', idx);
        if (colon == -1) return null;
        int startQuote = payloadJson.indexOf('"', colon);
        if (startQuote == -1) return null;
        int endQuote = payloadJson.indexOf('"', startQuote + 1);
        if (endQuote == -1) return null;
        return payloadJson.substring(startQuote + 1, endQuote);
    }

    private static byte[] hmacSha256(byte[] data, byte[] key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec spec = new SecretKeySpec(key, "HmacSHA256");
            mac.init(spec);
            return mac.doFinal(data);
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HMACSHA256", e);
        }
    }

    private static String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String escapeJson(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
