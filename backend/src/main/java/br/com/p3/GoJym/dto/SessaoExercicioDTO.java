package br.com.p3.GoJym.dto;

import br.com.p3.GoJym.model.Exercicio;
import br.com.p3.GoJym.model.SessaoTreino;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessaoExercicioDTO {
    private SessaoTreino sessaoTreino;
    private Exercicio exercicio;
    private int series;
    private int repeticoesMin;
    private int repeticoesMax;
    private int descanso;
    private int ordem;
}
