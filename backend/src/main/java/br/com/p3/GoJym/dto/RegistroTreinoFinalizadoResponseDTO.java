package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;


@Data
@AllArgsConstructor
public class RegistroTreinoFinalizadoResponseDTO {
    private final UUID id;
    private final Integer duracaoSegundos;
    private final Integer qtdSeries;
    private final Boolean concluido;
    private final Float cargaTotal;
    private final ExercicioMaiorCarga exercicioMaiorCarga;
}
