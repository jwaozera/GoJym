package br.com.p3.GoJym.controller;

import br.com.p3.GoJym.dto.RecordeExercicioResponseDTO;
import br.com.p3.GoJym.exceptions.ExercicioNaoEncontradoException;
import br.com.p3.GoJym.model.Usuario;
import br.com.p3.GoJym.service.RecordeExercicioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/recorde-exercicio")
public class RecordeExercicioController {
    private final RecordeExercicioService recordeExercicioService;

    public RecordeExercicioController(RecordeExercicioService recordeExercicioService) {
        this.recordeExercicioService = recordeExercicioService;
    }
    @GetMapping("/{exercicioId}")
    public ResponseEntity<RecordeExercicioResponseDTO> getRecordeExercicioByExercicio(@PathVariable Long exercicioId) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            RecordeExercicioResponseDTO responseDTO = recordeExercicioService.getRecordeExercicioByExercicio(exercicioId,usuarioLogado.getId());
            return ResponseEntity.ok(responseDTO);
        } catch (ExercicioNaoEncontradoException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
