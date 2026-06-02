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

        // Query counts between segunda and hoje (no futuro)
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
        return null;
    }
}
