package br.com.p3.GoJym.dto;

import br.com.p3.GoJym.model.Exercicio;
import br.com.p3.GoJym.model.RegistroTreino;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class RegistroSerieCriadaResponseDTO {
    private UUID id;

    private Exercicio exercicio;

    private Integer numeroSerie;

    private Float carga;

    private Integer repeticoes;

    private boolean recorde;
}
