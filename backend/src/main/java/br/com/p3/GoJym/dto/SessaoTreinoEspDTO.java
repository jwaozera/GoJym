package br.com.p3.GoJym.dto;

import br.com.p3.GoJym.model.Usuario;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class SessaoTreinoEspDTO {
    private UUID id;

    private String nome;

    private LocalDateTime createdAt;

    List<SessaoExercicioResponseDTO> exercicios;
}
