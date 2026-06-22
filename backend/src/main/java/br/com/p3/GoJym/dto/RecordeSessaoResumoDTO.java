package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RecordeSessaoResumoDTO {
    private Float valor;
    private LocalDateTime updatedAt;
}

