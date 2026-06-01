package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class EditSessaoTreinoResponseDTO {
    private UUID id;
    private String nome;
    private List<SessaoExercicioResponseDTO> exercicios;
}
