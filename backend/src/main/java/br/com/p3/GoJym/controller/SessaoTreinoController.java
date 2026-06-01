package br.com.p3.GoJym.controller;

import br.com.p3.GoJym.dto.*;
import br.com.p3.GoJym.exceptions.SessaoTreinoJaExisteException;
import br.com.p3.GoJym.exceptions.SessaoTreinoNaoEncontradoException;
import br.com.p3.GoJym.model.Usuario;
import br.com.p3.GoJym.service.SessaoTreinoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/workouts")
public class SessaoTreinoController {
    private final SessaoTreinoService sessaoTreinoService;

    public SessaoTreinoController(
            SessaoTreinoService sessaoTreinoService
    ){
        this.sessaoTreinoService=sessaoTreinoService;
    }

    @GetMapping
    public ResponseEntity<List<SessaoTreinoDTO>> listAllSessaoTreinoByUsuarioAutenticado() {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<SessaoTreinoDTO> sessaoTreinos = sessaoTreinoService.listAllSessaoTreinoByUserId(usuarioLogado.getId());
        return ResponseEntity.ok(sessaoTreinos);
    }

    @PostMapping("/create")
    public ResponseEntity<CreateSessaoTreinoResponseDTO> createSessaoTreino(@RequestBody CreateSessaoTreinoRequestDTO requestDTO) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try{
            CreateSessaoTreinoResponseDTO responseDTO= sessaoTreinoService.createSessaoTreino(usuarioLogado.getId(), requestDTO);
            return ResponseEntity.ok(responseDTO);
        }catch(SessaoTreinoJaExisteException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity deleteSessaoTreino(@PathVariable UUID id){
        try{
            sessaoTreinoService.deleteSessaoTreino(id);
            return ResponseEntity.noContent().build();
        }catch(Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/edit")
    public ResponseEntity<EditSessaoTreinoResponseDTO> editSessaoTreino(@PathVariable UUID id, @RequestBody EditSessaoTreinoRequestDTO requestDTO){
        try{
            EditSessaoTreinoResponseDTO responseDTO= sessaoTreinoService.editSessaoTreino(id, requestDTO);
            return ResponseEntity.ok(responseDTO);
        }catch(SessaoTreinoNaoEncontradoException e){
            return ResponseEntity.notFound().build();
        }catch(SessaoTreinoJaExisteException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessaoTreinoEspDTO> getSessaoTreinoById(@PathVariable UUID id){
        try{
            SessaoTreinoEspDTO respDTO= sessaoTreinoService.getSessaoTreinoById(id);
            return ResponseEntity.ok(respDTO);
        }catch(SessaoTreinoNaoEncontradoException e){
            return ResponseEntity.notFound().build();
        }
    }
}
