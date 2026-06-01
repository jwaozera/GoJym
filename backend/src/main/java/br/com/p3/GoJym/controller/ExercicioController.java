package br.com.p3.GoJym.controller;


import br.com.p3.GoJym.dto.ExercicioDTO;
import br.com.p3.GoJym.dto.ExercicioRequestDTO;
import br.com.p3.GoJym.exceptions.ExercicioJaExisteException;
import br.com.p3.GoJym.exceptions.ExercicioNaoEncontradoException;
import br.com.p3.GoJym.service.ExercicioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exercises")
public class ExercicioController {
    private final ExercicioService exercicioService;

    public ExercicioController(
            ExercicioService exercicioService
    ){
       this.exercicioService=exercicioService;
    }

    @GetMapping
    public ResponseEntity<List<ExercicioDTO>> listAllExercicios() {
        List<ExercicioDTO> exercicios = exercicioService.listAllExercicios();
        return ResponseEntity.ok(exercicios);
    }

    @PostMapping
    public ResponseEntity<ExercicioDTO> createExercicio(@RequestBody ExercicioRequestDTO exercicioRequestDTO) {
        try{
            ExercicioDTO exercicio = exercicioService.createExercicio(exercicioRequestDTO.getNome());
            return ResponseEntity.ok(exercicio);
        }catch(ExercicioJaExisteException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercicio(@PathVariable Long id) {
        try{
            exercicioService.deleteExercicio(id);
            return ResponseEntity.noContent().build();
        }catch(ExercicioNaoEncontradoException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExercicioDTO> updateExercicio(@RequestBody ExercicioRequestDTO exercicioRequestDTO, @PathVariable Long id){
        try{
            ExercicioDTO exercicioDTO = exercicioService.updateExercicio(exercicioRequestDTO.getNome(), id);
            return ResponseEntity.ok(exercicioDTO);
        }catch(ExercicioNaoEncontradoException e){
            return ResponseEntity.notFound().build();
        }catch(ExercicioJaExisteException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }


}
