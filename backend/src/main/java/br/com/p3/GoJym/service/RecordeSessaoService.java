package br.com.p3.GoJym.service;

import br.com.p3.GoJym.model.RecordeSessao;
import br.com.p3.GoJym.model.RecordeSessaoTipo;
import br.com.p3.GoJym.repository.RecordeSessaoRepository;
import br.com.p3.GoJym.dto.RecordeSessaoResumoDTO;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class RecordeSessaoService {

    private final RecordeSessaoRepository recordeSessaoRepository;

    public RecordeSessaoService(RecordeSessaoRepository recordeSessaoRepository) {
        this.recordeSessaoRepository = recordeSessaoRepository;
    }

    public Map<String, RecordeSessaoResumoDTO> getLatestRecordesPorUsuario(UUID usuarioId) {
        Map<String, RecordeSessaoResumoDTO> resultado = new HashMap<>();
        for (RecordeSessaoTipo tipo : RecordeSessaoTipo.values()) {
            Optional<RecordeSessao> op = recordeSessaoRepository.findTopByUsuarioIdAndTipoOrderByUpdatedAtDesc(usuarioId, tipo);
            if (op.isPresent()) {
                RecordeSessao r = op.get();
                resultado.put(tipo.name(), new RecordeSessaoResumoDTO(r.getValor(), r.getUpdatedAt()));
            } else {
                resultado.put(tipo.name(), null);
            }
        }
        return resultado;
    }
}
