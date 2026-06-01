package br.com.p3.GoJym.dto;

import br.com.p3.GoJym.model.Exercicio;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessaoExercicioRequestDTO {
    private Long exercicioId;
    private Integer series;
    private Integer repsMin;
    private Integer repsMax;
    private Integer descanso;
    private Integer ordem;
}
