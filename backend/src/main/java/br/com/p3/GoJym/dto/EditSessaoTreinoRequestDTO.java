package br.com.p3.GoJym.dto;

import lombok.Data;

import java.util.List;

@Data
public class EditSessaoTreinoRequestDTO {
    private String nome;
    private List<EditSessaoExercicioRequestDTO> exercicios;
}
