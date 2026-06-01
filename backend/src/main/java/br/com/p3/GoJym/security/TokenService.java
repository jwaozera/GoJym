package br.com.p3.GoJym.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {



    public String generateToken(String email) {
        Algorithm algorithm= Algorithm.HMAC256("CAZA");
        String token= JWT.create()
                .withIssuer("auth-api")
                .withSubject(email)
                .withExpiresAt(genExpirationDate())
                .sign(algorithm);
        return token;

    }

    public String validateToken(String token){
        Algorithm algorithm= Algorithm.HMAC256("CAZA");
        return JWT.require(algorithm)
                .withIssuer("auth-api")
                .build()
                .verify(token)
                .getSubject();
    }

    private Instant genExpirationDate(){
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
