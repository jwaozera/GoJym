package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class CreateSessaoTreinoResponseDTO {
    private UUID id;
    private String nome;
    private List<SessaoExercicioResponseDTO> exercicios;
    private LocalDateTime createdAt;
}
