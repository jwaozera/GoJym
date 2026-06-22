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

    @GetMapping("/periodo/{semanas}")
    public ResponseEntity<SemanaEstatisticasDTO> obterEstatisticasPorPeriodo(@PathVariable int semanas){
        // aceita apenas 4, 8 ou 12 semanas
        if (semanas != 4 && semanas != 8 && semanas != 12) {
            return ResponseEntity.badRequest().build();
        }

        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        SemanaEstatisticasDTO dto = registroTreinoService.obterEstatisticasPeriodo(semanas, usuarioLogado.getId());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/series-por-periodo/{semanas}")
    public ResponseEntity<java.util.List<br.com.p3.GoJym.dto.SeriePorSemanaDTO>> obterSeriesPorPeriodo(@PathVariable int semanas){
        // aceita apenas 4, 8 ou 12 semanas
        if (semanas != 4 && semanas != 8 && semanas != 12) {
            return ResponseEntity.badRequest().build();
        }

        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        java.util.List<br.com.p3.GoJym.dto.SeriePorSemanaDTO> dto = registroTreinoService.obterSeriesPorPeriodo(semanas, usuarioLogado.getId());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/maior-carga-exercicio/{exercicioId}/{semanas}")
    public ResponseEntity<java.util.List<br.com.p3.GoJym.dto.ExercicioCargaPorSemanaDTO>> obterMaiorCargaPorExercicio(@PathVariable Long exercicioId, @PathVariable int semanas){
        // aceita apenas 4, 8 ou 12 semanas
        if (semanas != 4 && semanas != 8 && semanas != 12) {
            return ResponseEntity.badRequest().build();
        }

        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        java.util.List<br.com.p3.GoJym.dto.ExercicioCargaPorSemanaDTO> dto = registroTreinoService.obterMaiorCargaPorExercicioPeriodo(exercicioId, semanas, usuarioLogado.getId());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/sequencia/{ano}/{mes}/{dia}")
    public ResponseEntity<SequenciaSemanalDTO> obterSequenciaSemanal(@PathVariable int ano, @PathVariable int mes, @PathVariable int dia){
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        SequenciaSemanalDTO dto = registroTreinoService.obterStreak(ano, mes, dia, usuarioLogado.getId());
        return ResponseEntity.ok(dto);
    }
}
