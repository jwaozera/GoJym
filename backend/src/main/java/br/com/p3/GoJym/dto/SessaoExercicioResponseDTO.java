package br.com.p3.GoJym.dto;

import br.com.p3.GoJym.model.Exercicio;
import br.com.p3.GoJym.model.SessaoTreino;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;
@Data
@AllArgsConstructor
public class SessaoExercicioResponseDTO {
    private UUID id;

    private Long exercicioId;

    private String exercicioNome;

    private Integer numSeries;

    private Integer repeticoesMin;

    private Integer repeticoesMax;

    private Integer ordem;

    private Integer descanso;
}
