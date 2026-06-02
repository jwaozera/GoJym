package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UltimoRegistroDTO {
    private float carga;
    private int repeticoes;
    private int numeroSerie;
}
