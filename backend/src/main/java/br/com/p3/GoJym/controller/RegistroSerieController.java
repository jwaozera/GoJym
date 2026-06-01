package br.com.p3.GoJym.controller;

import br.com.p3.GoJym.dto.RegistroSerieCriadaRequestDTO;
import br.com.p3.GoJym.dto.RegistroSerieCriadaResponseDTO;
import br.com.p3.GoJym.service.RegistroSerieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.List;
import br.com.p3.GoJym.dto.SeriesCountDiaDTO;
import org.springframework.security.core.context.SecurityContextHolder;
import br.com.p3.GoJym.model.Usuario;

@RestController
@RequestMapping("/execute/serie")
public class RegistroSerieController {


    private final RegistroSerieService registroSerieService;

    public RegistroSerieController(RegistroSerieService registroSerieService) {
        this.registroSerieService = registroSerieService;
    }

    @PostMapping("/{idRegistroTreino}")
    public ResponseEntity<RegistroSerieCriadaResponseDTO> criarRegistroSerie(@PathVariable UUID idRegistroTreino, @RequestBody RegistroSerieCriadaRequestDTO requestDTO){
        RegistroSerieCriadaResponseDTO response= registroSerieService.criarRegistroSerie(idRegistroTreino,requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/last-week")
    public ResponseEntity<List<SeriesCountDiaDTO>> contarSeriesUltimaSemana(){
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<SeriesCountDiaDTO> lista = registroSerieService.contarSeriesUltimaSemana(usuarioLogado.getId());
        return ResponseEntity.ok(lista);
    }
}
