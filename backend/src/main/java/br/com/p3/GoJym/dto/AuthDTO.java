package br.com.p3.GoJym.dto;

import lombok.Data;

@Data
public class AuthDTO {
    private String email;
    private String senhaHash;

}
