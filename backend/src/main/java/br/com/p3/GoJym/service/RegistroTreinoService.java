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
import br.com.p3.GoJym.repository.RecordeSessaoRepository;
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
import br.com.p3.GoJym.model.RecordeSessaoTipo;

@Service
public class RegistroTreinoService {


    private final SessaoTreinoRepository sessaoTreinoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RegistroTreinoRepository registroTreinoRepository;
    private final RegistroSerieRepository registroSerieRepository;
    private final RecordeSessaoRepository recordeSessaoRepository;

    public RegistroTreinoService(SessaoTreinoRepository sessaoTreinoRepository, UsuarioRepository usuarioRepository, RegistroTreinoRepository registroTreinoRepository, RegistroSerieRepository registroSerieRepository, RecordeSessaoRepository recordeSessaoRepository) {
        this.sessaoTreinoRepository = sessaoTreinoRepository;
        this.usuarioRepository = usuarioRepository;
        this.registroTreinoRepository = registroTreinoRepository;
        this.registroSerieRepository = registroSerieRepository;
        this.recordeSessaoRepository = recordeSessaoRepository;
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
        int qtdSeries = 0;

        if (series != null && !series.isEmpty()) {
            qtdSeries = series.size();
            for (RegistroSerie s : series) {
                if (s != null && s.getCarga() != null && s.getRepeticoes() != null) {
                    cargaTotal += s.getCarga() * s.getRepeticoes();
                    if (s.getCarga() > maiorCarga) {
                        maiorCarga = s.getCarga();
                        exercicioMaiorCarga = s.getExercicio().getNome();
                    }
                }
            }
        }

        // --- Recorde de sessão: comparar 3 métricas e atualizar/create RecordeSessao ---
        UUID usuarioId = registroTreinoSalvo.getUsuario() != null ? registroTreinoSalvo.getUsuario().getId() : null;
        java.time.LocalDateTime now = java.time.LocalDateTime.now();

        if (usuarioId != null) {
            // 1) maior_carga_total (soma das cargas * repetições)
            Float novoCargaTotal = cargaTotal;
            if (novoCargaTotal > 0f) {
                recordeSessaoRepository.findByUsuarioIdAndTipo(usuarioId, RecordeSessaoTipo.MAIOR_CARGA_TOTAL)
                        .ifPresentOrElse(recorde -> {
                            if (novoCargaTotal > recorde.getValor()) {
                                recorde.setValor(novoCargaTotal);
                                recorde.setRegistroTreino(registroTreinoSalvo);
                                recorde.setUpdatedAt(now);
                                recordeSessaoRepository.save(recorde);
                            }
                        }, () -> {
                            br.com.p3.GoJym.model.RecordeSessao novo = new br.com.p3.GoJym.model.RecordeSessao();
                            novo.setUsuario(registroTreinoSalvo.getUsuario());
                            novo.setTipo(RecordeSessaoTipo.MAIOR_CARGA_TOTAL);
                            novo.setValor(novoCargaTotal);
                            novo.setRegistroTreino(registroTreinoSalvo);
                            novo.setUpdatedAt(now);
                            recordeSessaoRepository.save(novo);
                        });
            }

            // 2) mais_series (quantidade de series na sessão)
            Float novoMaisSeries = (float) qtdSeries;
            if (novoMaisSeries > 0f) {
                recordeSessaoRepository.findByUsuarioIdAndTipo(usuarioId, RecordeSessaoTipo.MAIS_SERIES)
                        .ifPresentOrElse(recorde -> {
                            if (novoMaisSeries > recorde.getValor()) {
                                recorde.setValor(novoMaisSeries);
                                recorde.setRegistroTreino(registroTreinoSalvo);
                                recorde.setUpdatedAt(now);
                                recordeSessaoRepository.save(recorde);
                            }
                        }, () -> {
                            br.com.p3.GoJym.model.RecordeSessao novo = new br.com.p3.GoJym.model.RecordeSessao();
                            novo.setUsuario(registroTreinoSalvo.getUsuario());
                            novo.setTipo(RecordeSessaoTipo.MAIS_SERIES);
                            novo.setValor(novoMaisSeries);
                            novo.setRegistroTreino(registroTreinoSalvo);
                            novo.setUpdatedAt(now);
                            recordeSessaoRepository.save(novo);
                        });
            }

            // 3) maior_duracao (duração em segundos)
            Integer duracao = registroTreinoSalvo.getDuracaoSegundos();
            if (duracao != null && duracao > 0) {
                Float novoTempo = duracao.floatValue();
                recordeSessaoRepository.findByUsuarioIdAndTipo(usuarioId, RecordeSessaoTipo.MAIOR_DURACAO)
                        .ifPresentOrElse(recorde -> {
                            if (novoTempo > recorde.getValor()) {
                                recorde.setValor(novoTempo);
                                recorde.setRegistroTreino(registroTreinoSalvo);
                                recorde.setUpdatedAt(now);
                                recordeSessaoRepository.save(recorde);
                            }
                        }, () -> {
                            br.com.p3.GoJym.model.RecordeSessao novo = new br.com.p3.GoJym.model.RecordeSessao();
                            novo.setUsuario(registroTreinoSalvo.getUsuario());
                            novo.setTipo(RecordeSessaoTipo.MAIOR_DURACAO);
                            novo.setValor(novoTempo);
                            novo.setRegistroTreino(registroTreinoSalvo);
                            novo.setUpdatedAt(now);
                            recordeSessaoRepository.save(novo);
                        });
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

    public SemanaEstatisticasDTO obterEstatisticasPeriodo(int semanas, UUID idUsuario) {
        // Valida semanas: aceita 4,8,12. Se inválido, usa 4
        if (semanas != 4 && semanas != 8 && semanas != 12) {
            semanas = 4;
        }

        LocalDate fim = LocalDate.now();
        LocalDate inicio = fim.minusWeeks(semanas);

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

        if (!registros.isEmpty()) {
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

    public java.util.List<br.com.p3.GoJym.dto.SeriePorSemanaDTO> obterSeriesPorPeriodo(int semanas, UUID idUsuario) {
        // Valida semanas: aceita 4,8,12. Se inválido, usa 4
        if (semanas != 4 && semanas != 8 && semanas != 12) {
            semanas = 4;
        }

        java.util.List<br.com.p3.GoJym.dto.SeriePorSemanaDTO> resultado = new java.util.ArrayList<>();

        LocalDate hoje = LocalDate.now();
        // primeira semana referencia: (semanas-1) semanas atrás
        LocalDate primeiraReferencia = hoje.minusWeeks(semanas - 1);

        for (int i = 0; i < semanas; i++) {
            LocalDate referencia = primeiraReferencia.plusWeeks(i);

            // calcula segunda (inicio) e domingo (fim) da semana que contém 'referencia'
            LocalDate inicio = referencia;
            while (inicio.getDayOfWeek() != DayOfWeek.MONDAY) {
                inicio = inicio.minusDays(1);
            }
            LocalDate fim = inicio;
            while (fim.getDayOfWeek() != DayOfWeek.SUNDAY) {
                fim = fim.plusDays(1);
            }

            // busca registros nessa semana
            java.util.List<RegistroTreino> registros = registroTreinoRepository.findAllByUsuarioIdAndDataBetween(idUsuario, inicio, fim);

            int totalSeries = 0;
            if (registros != null && !registros.isEmpty()) {
                java.util.List<UUID> registroIds = registros.stream().map(RegistroTreino::getId).collect(Collectors.toList());
                java.util.List<RegistroSerie> todasSeries = registroSerieRepository.findByRegistroTreinoIdIn(registroIds);
                if (todasSeries != null) {
                    totalSeries = todasSeries.size();
                }
            }

            // semana index: 1 = mais antiga
            resultado.add(new br.com.p3.GoJym.dto.SeriePorSemanaDTO(i + 1, totalSeries));
        }

        return resultado;
    }

    public java.util.List<br.com.p3.GoJym.dto.ExercicioCargaPorSemanaDTO> obterMaiorCargaPorExercicioPeriodo(Long exercicioId, int semanas, UUID idUsuario) {
        // Valida semanas: aceita 4,8,12. Se inválido, usa 4
        if (semanas != 4 && semanas != 8 && semanas != 12) {
            semanas = 4;
        }

        java.util.List<br.com.p3.GoJym.dto.ExercicioCargaPorSemanaDTO> resultado = new java.util.ArrayList<>();

        LocalDate hoje = LocalDate.now();
        LocalDate primeiraReferencia = hoje.minusWeeks(semanas - 1);

        for (int i = 0; i < semanas; i++) {
            LocalDate referencia = primeiraReferencia.plusWeeks(i);

            // calcula segunda (inicio) e domingo (fim) da semana que contém 'referencia'
            LocalDate inicio = referencia;
            while (inicio.getDayOfWeek() != DayOfWeek.MONDAY) {
                inicio = inicio.minusDays(1);
            }
            LocalDate fim = inicio;
            while (fim.getDayOfWeek() != DayOfWeek.SUNDAY) {
                fim = fim.plusDays(1);
            }

            // busca registros nessa semana
            java.util.List<RegistroTreino> registros = registroTreinoRepository.findAllByUsuarioIdAndDataBetween(idUsuario, inicio, fim);

            Float maiorCargaSemana = null;
            if (registros != null && !registros.isEmpty()) {
                java.util.List<UUID> registroIds = registros.stream().map(RegistroTreino::getId).collect(Collectors.toList());
                java.util.List<RegistroSerie> todasSeries = registroSerieRepository.findByRegistroTreinoIdIn(registroIds);
                if (todasSeries != null && !todasSeries.isEmpty()) {
                    for (RegistroSerie rs : todasSeries) {
                        if (rs != null && rs.getExercicio() != null && rs.getExercicio().getId() != null && rs.getExercicio().getId().equals(exercicioId) && rs.getCarga() != null) {
                            if (maiorCargaSemana == null || rs.getCarga() > maiorCargaSemana) {
                                maiorCargaSemana = rs.getCarga();
                            }
                        }
                    }
                }
            }

            resultado.add(new br.com.p3.GoJym.dto.ExercicioCargaPorSemanaDTO(i + 1, maiorCargaSemana));
        }

        return resultado;
    }

}
