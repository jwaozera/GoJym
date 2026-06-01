package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegistroSerieCriadaRequestDTO {
    private Long idExercicio;
    private Integer numeroSerie;
    private Float carga;
    private Integer repeticoes;

}
