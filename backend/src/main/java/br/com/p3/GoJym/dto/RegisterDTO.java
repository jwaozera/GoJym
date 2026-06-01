package br.com.p3.GoJym.dto;

import lombok.Data;

@Data
public class RegisterDTO {
    private String nome;
    private String email;
    private String senhaHash;
}
