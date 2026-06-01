package br.com.p3.GoJym.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CalendarioDiaDTO {
    private Integer dia;
    private Boolean ativo;
    private String nomeTreino;
}

