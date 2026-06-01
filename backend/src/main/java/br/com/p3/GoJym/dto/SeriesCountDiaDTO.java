package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeriesCountDiaDTO {
    private LocalDate data;
    private Integer dia;
    private Integer quantidade;
}
