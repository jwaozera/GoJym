package br.com.p3.GoJym.controller;

import br.com.p3.GoJym.model.Usuario;
import br.com.p3.GoJym.service.RecordeSessaoService;
import br.com.p3.GoJym.dto.RecordeSessaoResumoDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/recorde-sessao")
public class RecordeSessaoController {

    private final RecordeSessaoService recordeSessaoService;

    public RecordeSessaoController(RecordeSessaoService recordeSessaoService) {
        this.recordeSessaoService = recordeSessaoService;
    }

    @GetMapping("/latest")
    public ResponseEntity<Map<String, RecordeSessaoResumoDTO>> getLatestRecordesPorToken() {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Map<String, RecordeSessaoResumoDTO> resumo = recordeSessaoService.getLatestRecordesPorUsuario(usuarioLogado.getId());
        return ResponseEntity.ok(resumo);
    }
}
