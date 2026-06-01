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
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

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



}
