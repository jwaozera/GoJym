package br.com.p3.GoJym.service;

import br.com.p3.GoJym.dto.ExercicioMaiorCarga;
import br.com.p3.GoJym.dto.RegistroTreinoCriadoResponseDTO;
import br.com.p3.GoJym.dto.RegistroTreinoFinalizadoRequestDTO;
import br.com.p3.GoJym.dto.RegistroTreinoFinalizadoResponseDTO;
import br.com.p3.GoJym.exceptions.RegistroTreinoNaoEncontradoException;
import br.com.p3.GoJym.exceptions.SessaoTreinoNaoEncontradoException;
import br.com.p3.GoJym.exceptions.UsuarioNaoEncontradoException;
import br.com.p3.GoJym.model.RegistroSerie;
import br.com.p3.GoJym.model.RegistroTreino;
import br.com.p3.GoJym.model.SessaoTreino;
import br.com.p3.GoJym.model.Usuario;
import br.com.p3.GoJym.repository.RegistroTreinoRepository;
import br.com.p3.GoJym.repository.RegistroSerieRepository;
import br.com.p3.GoJym.repository.SessaoTreinoRepository;
import br.com.p3.GoJym.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.DayOfWeek;
import java.util.List;
import java.util.UUID;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;
import br.com.p3.GoJym.dto.SemanaEstatisticasDTO;
import br.com.p3.GoJym.dto.SequenciaSemanalDTO;

@Service
public class RegistroTreinoService {


    private final SessaoTreinoRepository sessaoTreinoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RegistroTreinoRepository registroTreinoRepository;
    private final RegistroSerieRepository registroSerieRepository;

    public RegistroTreinoService(SessaoTreinoRepository sessaoTreinoRepository, UsuarioRepository usuarioRepository, RegistroTreinoRepository registroTreinoRepository, RegistroSerieRepository registroSerieRepository) {
        this.sessaoTreinoRepository = sessaoTreinoRepository;
        this.usuarioRepository = usuarioRepository;
        this.registroTreinoRepository = registroTreinoRepository;
        this.registroSerieRepository = registroSerieRepository;
    }

    public SemanaEstatisticasDTO obterEstatisticasSemana(int ano, int mes, int dia, UUID idUsuario) {
        LocalDate referencia = LocalDate.of(ano, mes, dia);
        // calcula segunda (inicio) e domingo (fim) da semana que contém 'referencia'
        LocalDate inicio = referencia;
        while (inicio.getDayOfWeek() != DayOfWeek.MONDAY) {
            inicio = inicio.minusDays(1);
        }
        LocalDate fim = inicio;
        while (fim.getDayOfWeek() != DayOfWeek.SUNDAY) {
            fim = fim.plusDays(1);
        }

        List<RegistroTreino> registros = registroTreinoRepository.findAllByUsuarioIdAndDataBetween(idUsuario, inicio, fim);

        int totalSessoes = registros.size();

        // soma duracao (em segundos), cuidando de nulos
        int tempoTotal = registros.stream()
                .map(RegistroTreino::getDuracaoSegundos)
                .filter(d -> d != null)
                .mapToInt(Integer::intValue)
                .sum();

        // dias ativos: dias únicos com registroTreino
        int diasAtivos = (int) registros.stream()
                .map(RegistroTreino::getData)
                .distinct()
                .count();

        // soma de todas as cargas * repeticoes e contagem de series
        float cargaTotal = 0f;
        int totalSeries = 0;

        if (registros != null && !registros.isEmpty()) {
            List<UUID> registroIds = registros.stream().map(RegistroTreino::getId).collect(Collectors.toList());
            List<RegistroSerie> todasSeries = registroSerieRepository.findByRegistroTreinoIdIn(registroIds);
            Map<UUID, List<RegistroSerie>> seriesPorRegistro = todasSeries.stream()
                    .collect(Collectors.groupingBy(rs -> rs.getRegistroTreino().getId()));

            for (RegistroTreino rt : registros) {
                List<RegistroSerie> series = seriesPorRegistro.get(rt.getId());
                if (series != null && !series.isEmpty()) {
                    totalSeries += series.size();
                    for (RegistroSerie rs : series) {
                        if (rs != null && rs.getCarga() != null && rs.getRepeticoes() != null) {
                            cargaTotal += rs.getCarga() * rs.getRepeticoes();
                        }
                    }
                }
            }
        }

        float mediaSeriesPorSessao = 0f;
        if (totalSessoes > 0) {
            mediaSeriesPorSessao = (float) totalSeries / (float) totalSessoes;
        }

        return new SemanaEstatisticasDTO(totalSessoes, cargaTotal, tempoTotal, totalSeries, mediaSeriesPorSessao, diasAtivos);
    }

    public RegistroTreinoCriadoResponseDTO iniciarRegistroTreino(UUID idSessaoTreino, UUID idUsuario) {
        SessaoTreino sessaoTreino= sessaoTreinoRepository.findById(idSessaoTreino).orElseThrow(SessaoTreinoNaoEncontradoException::new);
        Usuario usuario= usuarioRepository.findById(idUsuario).orElseThrow(UsuarioNaoEncontradoException::new);
        RegistroTreino registroTreino= new RegistroTreino();
        registroTreino.setSessaoTreino(sessaoTreino);
        registroTreino.setConcluido(false);
        registroTreino.setUsuario(usuario);
        registroTreino.setData(LocalDate.now());
        RegistroTreino registroTreinoSalvo =registroTreinoRepository.save(registroTreino);

        return new RegistroTreinoCriadoResponseDTO(registroTreinoSalvo.getId());
    }

    public RegistroTreinoFinalizadoResponseDTO finalizarRegistroTreino(UUID idRegistroTreino, RegistroTreinoFinalizadoRequestDTO requestDTO) {
        RegistroTreino registroTreino= registroTreinoRepository.findById(idRegistroTreino).orElseThrow(RegistroTreinoNaoEncontradoException::new);
        registroTreino.setConcluido(true);
        registroTreino.setDuracaoSegundos(requestDTO.getDuracaoSegundos());
        RegistroTreino registroTreinoSalvo =registroTreinoRepository.save(registroTreino);

        List<RegistroSerie> series = registroSerieRepository.findByRegistroTreinoId(idRegistroTreino);

        float cargaTotal = 0f;
        float maiorCarga = 0f;
        String exercicioMaiorCarga="";

        if (series != null && !series.isEmpty()) {
            for (RegistroSerie s : series) {
                if (s != null && s.getCarga() != null) {
                    cargaTotal += s.getCarga();
                    if (s.getCarga() > maiorCarga) {
                        maiorCarga = s.getCarga();
                        exercicioMaiorCarga = s.getExercicio().getNome();
                    }
                }
            }
        }
        return new RegistroTreinoFinalizadoResponseDTO(
                registroTreinoSalvo.getId(),
                registroTreinoSalvo.getDuracaoSegundos(),
                series.size(),
                registroTreinoSalvo.getConcluido(),
                cargaTotal,
                new ExercicioMaiorCarga(maiorCarga,exercicioMaiorCarga)
        );
    }

    public List<br.com.p3.GoJym.dto.CalendarioDiaDTO> buscarCalendarioMes(int ano, int mes, UUID idUsuario) {
        LocalDate inicio = LocalDate.of(ano, mes, 1);
        LocalDate fim = inicio.withDayOfMonth(inicio.lengthOfMonth());

        List<RegistroTreino> registros = registroTreinoRepository.findAllByUsuarioIdAndDataBetween(idUsuario, inicio, fim);

        Map<LocalDate, List<RegistroTreino>> porData = registros.stream()
                .collect(Collectors.groupingBy(RegistroTreino::getData));

        List<br.com.p3.GoJym.dto.CalendarioDiaDTO> calendario = new ArrayList<>();
        int diasNoMes = inicio.lengthOfMonth();
        for (int dia = 1; dia <= diasNoMes; dia++) {
            LocalDate current = LocalDate.of(ano, mes, dia);
            List<RegistroTreino> regs = porData.get(current);
            boolean ativo = regs != null && !regs.isEmpty();
            String nomeTreino = null;
            if (ativo) {
                // Escolhe o primeiro registro para recuperar o nome da sessão de treino
                RegistroTreino r = regs.get(0);
                if (r.getSessaoTreino() != null) {
                    nomeTreino = r.getSessaoTreino().getNome();
                }
            }
            calendario.add(new br.com.p3.GoJym.dto.CalendarioDiaDTO(dia, ativo, nomeTreino));
        }

        return calendario;
    }

    public SequenciaSemanalDTO obterSequenciaSemanal(UUID idUsuario) {
        return obterStreak(LocalDate.now(), idUsuario);
    }

    public SequenciaSemanalDTO obterStreak(int ano, int mes, int dia, UUID idUsuario) {
        LocalDate dataReferencia = LocalDate.of(ano, mes, dia);
        return obterStreak(dataReferencia, idUsuario);
    }

    private SequenciaSemanalDTO obterStreak(LocalDate dataInicial, UUID idUsuario) {
        int totalSemanas = 0;
        LocalDate referencia = dataInicial;

        // Loop até encontrar uma semana sem registroTreino
        while (true) {
            // Calcula segunda (inicio) e domingo (fim) da semana que contém 'referencia'
            LocalDate inicio = referencia;
            while (inicio.getDayOfWeek() != DayOfWeek.MONDAY) {
                inicio = inicio.minusDays(1);
            }
            LocalDate fim = inicio;
            while (fim.getDayOfWeek() != DayOfWeek.SUNDAY) {
                fim = fim.plusDays(1);
            }

            // Busca registroTreino nessa semana
            List<RegistroTreino> registros = registroTreinoRepository.findAllByUsuarioIdAndDataBetween(idUsuario, inicio, fim);

            // Se não houver, quebra o loop
            if (registros.isEmpty()) {
                break;
            }

            // Incrementa o contador e volta 1 semana
            totalSemanas++;
            referencia = referencia.minusDays(7);
        }

        return new SequenciaSemanalDTO(totalSemanas);
    }

}
