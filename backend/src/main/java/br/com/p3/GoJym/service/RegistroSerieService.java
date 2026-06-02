package br.com.p3.GoJym.service;

import br.com.p3.GoJym.dto.RegistroSerieCriadaRequestDTO;
import br.com.p3.GoJym.dto.RegistroSerieCriadaResponseDTO;
import br.com.p3.GoJym.dto.UltimoRegistroDTO;
import br.com.p3.GoJym.model.Exercicio;
import br.com.p3.GoJym.model.RegistroSerie;
import br.com.p3.GoJym.model.RegistroTreino;
import br.com.p3.GoJym.repository.ExercicioRepository;
import br.com.p3.GoJym.repository.RegistroSerieRepository;
import br.com.p3.GoJym.repository.RegistroTreinoRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.time.LocalDate;
import java.time.DayOfWeek;
import java.time.temporal.TemporalAdjusters;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;
import br.com.p3.GoJym.dto.SeriesCountDiaDTO;
import java.util.LinkedHashMap;

@Service
public class RegistroSerieService {
    private final RegistroTreinoRepository registroTreinoRepository;
    private final ExercicioRepository exercicioRepository;
    private final RegistroSerieRepository registroSerieRepository;
    private final RecordeExercicioService recordeExercicioService;

    public RegistroSerieService(RegistroTreinoRepository registroTreinoRepository, ExercicioRepository exercicioRepository, RegistroSerieRepository registroSerieRepository, RecordeExercicioService recordeExercicioService) {
        this.registroTreinoRepository = registroTreinoRepository;
        this.exercicioRepository = exercicioRepository;
        this.registroSerieRepository = registroSerieRepository;
        this.recordeExercicioService = recordeExercicioService;
    }

    public RegistroSerieCriadaResponseDTO criarRegistroSerie(UUID idRegistroTreino, RegistroSerieCriadaRequestDTO requestDTO) {
        RegistroTreino registroTreino=registroTreinoRepository.findById(idRegistroTreino).orElse(null);
        Exercicio exercicio= exercicioRepository.findById(requestDTO.getIdExercicio()).orElse(null);

        RegistroSerie registroSerie=new RegistroSerie();
        registroSerie.setRegistroTreino(registroTreino);
        registroSerie.setRepeticoes(requestDTO.getRepeticoes());
        registroSerie.setCarga(requestDTO.getCarga());
        registroSerie.setNumeroSerie(requestDTO.getNumeroSerie());
        registroSerie.setExercicio(exercicio);


        RegistroSerie registroSerieSalva= registroSerieRepository.save(registroSerie);
        boolean recorde=recordeExercicioService.verificarRecorde(registroSerieSalva);
        return new RegistroSerieCriadaResponseDTO(registroSerieSalva.getId(),registroSerieSalva.getExercicio(),registroSerieSalva.getNumeroSerie(),registroSerieSalva.getCarga(),registroSerieSalva.getRepeticoes(),recorde);
    }

    public List<SeriesCountDiaDTO> contarSeriesUltimaSemana(UUID idUsuario) {
        LocalDate hoje = LocalDate.now();
        LocalDate segunda = hoje.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate domingo = segunda.plusDays(6);

        List<Object[]> resultados = registroSerieRepository.countSeriesByUsuarioBetweenDates(idUsuario, segunda, hoje);

        Map<LocalDate, Long> mapa = resultados.stream()
                .collect(Collectors.toMap(r -> (LocalDate) r[0], r -> ((Number) r[1]).longValue()));

        List<SeriesCountDiaDTO> lista = new ArrayList<>();
        for (LocalDate data = segunda; !data.isAfter(domingo); data = data.plusDays(1)) {
            int quantidade = 0;
            if (!data.isAfter(hoje)) {
                quantidade = mapa.getOrDefault(data, 0L).intValue();
            }
            lista.add(new br.com.p3.GoJym.dto.SeriesCountDiaDTO(data, data.getDayOfMonth(), quantidade));
        }

        return lista;
    }

    public List<UltimoRegistroDTO> getUltimasSeries(UUID id, Long exercicioId) {
        List<RegistroSerie> allSeries = registroSerieRepository.getUltimasSeriesByUsuarioAndExercicio(id, exercicioId);

        if (allSeries.isEmpty()) {
            return new ArrayList<>();
        }

        // Pega o ID do último RegistroTreino (primeira série já está ordenada pelo mais recente)
        UUID lastTreinoId = allSeries.get(0).getRegistroTreino().getId();

        // Filtra apenas séries do último treino
        List<RegistroSerie> lastTreinoSeries = allSeries.stream()
                .filter(rs -> rs.getRegistroTreino().getId().equals(lastTreinoId))
                .collect(Collectors.toList());

        // Remove duplicatas por numeroSerie, mantendo a mais recente (primeiro a aparecer na lista)
        Map<Integer, RegistroSerie> distinctByNumeroSerie = new LinkedHashMap<>();
        for (RegistroSerie rs : lastTreinoSeries) {
            Integer numeroSerie = rs.getNumeroSerie() != null ? rs.getNumeroSerie() : 0;
            // putIfAbsent garante que mantém o primeiro (mais recente)
            distinctByNumeroSerie.putIfAbsent(numeroSerie, rs);
        }

        // Mapeia para DTOs
        return distinctByNumeroSerie.values().stream()
                .map(rs -> new UltimoRegistroDTO(
                        rs.getCarga() != null ? rs.getCarga() : 0f,
                        rs.getRepeticoes() != null ? rs.getRepeticoes() : 0,
                        rs.getNumeroSerie() != null ? rs.getNumeroSerie() : 0
                ))
                .collect(Collectors.toList());
    }
}
