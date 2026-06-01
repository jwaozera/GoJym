package br.com.p3.GoJym.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "sessao_exercicio")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessaoExercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sessao_treino_id", nullable = false)
    private SessaoTreino sessaoTreino;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercicio_id", nullable = false)
    private Exercicio exercicio;

    @Column(name = "num_series", nullable = false)
    private Integer numSeries;

    @Column(name = "repeticoes_min", nullable = false)
    private Integer repeticoesMin;

    @Column(name = "repeticoes_max", nullable = false)
    private Integer repeticoesMax;

    @Column(nullable = false)
    private Integer ordem;

    @Column(name = "descanso")
    private Integer descanso;
}