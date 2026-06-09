package br.com.p3.GoJym.controller;

import br.com.p3.GoJym.dto.RegistroTreinoCriadoResponseDTO;
import br.com.p3.GoJym.dto.RegistroTreinoFinalizadoRequestDTO;
import br.com.p3.GoJym.dto.RegistroTreinoFinalizadoResponseDTO;
import br.com.p3.GoJym.model.Usuario;
import br.com.p3.GoJym.service.RegistroTreinoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import br.com.p3.GoJym.dto.CalendarioDiaDTO;
import br.com.p3.GoJym.dto.SemanaEstatisticasDTO;
import br.com.p3.GoJym.dto.SequenciaSemanalDTO;

@RestController
@RequestMapping("/registro-treino")
public class RegistroTreinoController {

    private final RegistroTreinoService registroTreinoService;

    public RegistroTreinoController(RegistroTreinoService registroTreinoService) {
        this.registroTreinoService = registroTreinoService;
    }

    @PostMapping("/execute/{idSessaoTreino}")
    public ResponseEntity<RegistroTreinoCriadoResponseDTO> iniciarRegistroTreino(@PathVariable UUID idSessaoTreino){
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        RegistroTreinoCriadoResponseDTO response= registroTreinoService.iniciarRegistroTreino(idSessaoTreino,usuarioLogado.getId());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/execute/{idRegistroTreino}")
    public ResponseEntity<RegistroTreinoFinalizadoResponseDTO> finalizarRegistroTreino(@PathVariable UUID idRegistroTreino, @RequestBody RegistroTreinoFinalizadoRequestDTO requestDTO){
        RegistroTreinoFinalizadoResponseDTO response= registroTreinoService.finalizarRegistroTreino(idRegistroTreino,requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{ano}/{mes}")
    public ResponseEntity<List<CalendarioDiaDTO>> buscarCalendarioMes(@PathVariable int ano, @PathVariable int mes){
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<CalendarioDiaDTO> calendario = registroTreinoService.buscarCalendarioMes(ano, mes, usuarioLogado.getId());
        return ResponseEntity.ok(calendario);
    }

    @GetMapping("/semana/{ano}/{mes}/{dia}")
    public ResponseEntity<SemanaEstatisticasDTO> obterEstatisticasSemana(@PathVariable int ano, @PathVariable int mes, @PathVariable int dia){
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        SemanaEstatisticasDTO dto = registroTreinoService.obterEstatisticasSemana(ano, mes, dia, usuarioLogado.getId());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/sequencia/{ano}/{mes}/{dia}")
    public ResponseEntity<SequenciaSemanalDTO> obterSequenciaSemanal(@PathVariable int ano, @PathVariable int mes, @PathVariable int dia){
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        SequenciaSemanalDTO dto = registroTreinoService.obterStreak(ano, mes, dia, usuarioLogado.getId());
        return ResponseEntity.ok(dto);
    }
}
