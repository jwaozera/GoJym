package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSessaoTreinoRequestDTO {
    private String nome;
    private List<SessaoExercicioRequestDTO> exercicios;
}
