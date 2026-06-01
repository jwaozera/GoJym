package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RecordeExercicioResponseDTO {
    private Float maiorCarga;
    private Float maiorVolume;
    private LocalDateTime maiorCargaUpdatedAt;
    private LocalDateTime maiorVolumeUpdatedAt;

}
