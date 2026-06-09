package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SemanaEstatisticasDTO {
    private int totalSessoes;
    private float cargaTotal;
    private int tempoTotal;
    private int totalSeries;
    private float mediaSeriesPorSessao;
    private int diasAtivos;
}

