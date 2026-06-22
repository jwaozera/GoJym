package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RecordeSessaoDTO {
    private String nomeExercicio;
    private Float maiorCarga;
    private LocalDateTime maiorCargaUpdatedAt;
}



