package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeriePorSemanaDTO {
    // semana 1 = mais antiga no período, semana N = semana atual
    private int semana;
    private int totalSeries;
}

