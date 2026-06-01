package br.com.p3.GoJym.dto;

import br.com.p3.GoJym.service.ExercicioService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExercicioDTO {
    private Long id;
    private String nome;

}
