package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class SessaoTreinoDTO {
    private UUID id;
    private String nome;
    private LocalDateTime createdAt;
    private int qtdExercicios;
}
