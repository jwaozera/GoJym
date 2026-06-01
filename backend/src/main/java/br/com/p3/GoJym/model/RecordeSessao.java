package br.com.p3.GoJym.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "recorde_sessao")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecordeSessao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private Float valor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "registro_treino_id", nullable = false)
    private RegistroTreino registroTreino;


    @Column(name = "updated_at")
    private LocalDateTime UpdatedAt;
}