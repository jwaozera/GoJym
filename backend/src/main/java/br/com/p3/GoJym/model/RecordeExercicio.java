package br.com.p3.GoJym.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "recorde_exercicio")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecordeExercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercicio_id", nullable = false)
    private Exercicio exercicio;

    @Column(name = "maior_volume")
    private Float maiorVolume;

    @Column(name = "maior_carga")
    private Float maiorCarga;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registro_serie_id")
    private RegistroSerie registroSerie;

    @Column(name = "maior_volume_updated_at")
    private LocalDateTime maiorVolumeUpdatedAt;

    @Column(name = "maior_carga_updated_at")
    private LocalDateTime maiorCargaUpdatedAt;
}