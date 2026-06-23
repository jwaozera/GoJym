package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExercicioCargaPorSemanaDTO {
    private int semana; // 1 = mais antiga no período, N = semana atual
    private Float maiorCarga; // em kg, pode ser null se nenhuma série
}

