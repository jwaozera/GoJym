package br.com.p3.GoJym.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "registro_treino")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistroTreino {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sessao_treino_id", nullable = false)
    private SessaoTreino sessaoTreino;

    @Column(nullable = false)
    private LocalDate data;

    @Column(nullable = false)
    private Boolean concluido;

    @Column(name = "duracao_segundos")
    private Integer duracaoSegundos;

}
