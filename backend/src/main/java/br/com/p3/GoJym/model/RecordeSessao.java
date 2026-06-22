package br.com.p3.GoJym.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;
import br.com.p3.GoJym.model.RecordeSessaoTipo;

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecordeSessaoTipo tipo;

    @Column(nullable = false)
    private Float valor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "registro_treino_id", nullable = false)
    private RegistroTreino registroTreino;


    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}