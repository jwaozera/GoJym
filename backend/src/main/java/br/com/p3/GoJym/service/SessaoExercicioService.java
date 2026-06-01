package br.com.p3.GoJym.service;


import br.com.p3.GoJym.dto.EditSessaoExercicioRequestDTO;
import br.com.p3.GoJym.dto.SessaoExercicioRequestDTO;
import br.com.p3.GoJym.dto.SessaoExercicioResponseDTO;
import br.com.p3.GoJym.model.Exercicio;
import br.com.p3.GoJym.model.SessaoExercicio;
import br.com.p3.GoJym.model.SessaoTreino;
import br.com.p3.GoJym.repository.ExercicioRepository;
import br.com.p3.GoJym.repository.SessaoExercicioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class SessaoExercicioService {
    private final SessaoExercicioRepository sessaoExercicioRepository;
    private final ExercicioRepository exercicioRepository;

    public SessaoExercicioService(SessaoExercicioRepository sessaoExercicioRepository, ExercicioRepository exercicioRepository){
        this.sessaoExercicioRepository=sessaoExercicioRepository;
        this.exercicioRepository=exercicioRepository;
    }


    public List<SessaoExercicioResponseDTO> createSessoesExercicio(List<SessaoExercicioRequestDTO> requestDTO, SessaoTreino sessaoTreino){
        List<SessaoExercicioResponseDTO> exercicioResponseDTOS=new ArrayList<>();
        for(SessaoExercicioRequestDTO exercicio : requestDTO){
                Exercicio exercicioReferenciado = exercicioRepository.findById(exercicio.getExercicioId()).orElse(null);

               SessaoExercicio sessaoExercicio = new SessaoExercicio();
               sessaoExercicio.setExercicio(exercicioReferenciado);
               sessaoExercicio.setSessaoTreino(sessaoTreino);
               sessaoExercicio.setDescanso(exercicio.getDescanso());
               sessaoExercicio.setRepeticoesMin(exercicio.getRepsMin());
               sessaoExercicio.setRepeticoesMax(exercicio.getRepsMax());
               sessaoExercicio.setOrdem(exercicio.getOrdem());
               sessaoExercicio.setNumSeries(exercicio.getSeries());
               SessaoExercicio sessaoExercicioSalva=sessaoExercicioRepository.save(sessaoExercicio);

               exercicioResponseDTOS.add(new SessaoExercicioResponseDTO(sessaoExercicioSalva.getId(),sessaoExercicioSalva.getExercicio().getId() ,sessaoExercicioSalva.getExercicio().getNome(),  sessaoExercicioSalva.getNumSeries(),sessaoExercicioSalva.getRepeticoesMin(), sessaoExercicioSalva.getRepeticoesMax(), sessaoExercicioSalva.getOrdem(), sessaoExercicioSalva.getDescanso()));
           }
        return exercicioResponseDTOS;
    }

    @Transactional
    public List<SessaoExercicioResponseDTO> editSessaoExercicios(List<EditSessaoExercicioRequestDTO> requestDTO, SessaoTreino sessaoTreino) {
        List<SessaoExercicioResponseDTO> exercicioResponseDTOS = new ArrayList<>();

        Set<UUID> idsSalvos = new HashSet<>();

        for (EditSessaoExercicioRequestDTO exercicio : requestDTO) {
            SessaoExercicio exercicioEditado = new SessaoExercicio();
            if (exercicio.getId() != null) {
                exercicioEditado.setId(exercicio.getId());
            }
            exercicioEditado.setExercicio(exercicioRepository.findById(exercicio.getExercicioId()).orElse(null));
            exercicioEditado.setSessaoTreino(sessaoTreino);
            exercicioEditado.setDescanso(exercicio.getDescanso());
            exercicioEditado.setRepeticoesMin(exercicio.getRepsMin());
            exercicioEditado.setRepeticoesMax(exercicio.getRepsMax());
            exercicioEditado.setOrdem(exercicio.getOrdem());
            exercicioEditado.setNumSeries(exercicio.getSeries());

            SessaoExercicio exercicioEditadoSalvo = sessaoExercicioRepository.save(exercicioEditado);

            idsSalvos.add(exercicioEditadoSalvo.getId());

            exercicioResponseDTOS.add(new SessaoExercicioResponseDTO(
                    exercicioEditadoSalvo.getId(),
                    exercicioEditadoSalvo.getExercicio().getId(),
                    exercicioEditadoSalvo.getExercicio().getNome(),
                    exercicioEditadoSalvo.getNumSeries(),
                    exercicioEditadoSalvo.getRepeticoesMin(),
                    exercicioEditadoSalvo.getRepeticoesMax(),
                    exercicioEditadoSalvo.getOrdem(),
                    exercicioEditadoSalvo.getDescanso()));
        }

        // Deletar do banco os registros associados a esta sessaoTreino que NÃO foram enviados no request
        List<SessaoExercicio> existentes = sessaoExercicioRepository.findAllBySessaoTreinoId(sessaoTreino.getId());
        for (SessaoExercicio existente : existentes) {
            if (!idsSalvos.contains(existente.getId())) {
                sessaoExercicioRepository.delete(existente);
            }
        }

        return exercicioResponseDTOS;
    }

    public List<SessaoExercicioResponseDTO> getSessaoExerciciosBySessaoTreinoId(UUID id){
        List<SessaoExercicio> sessaoExercicios = sessaoExercicioRepository.findAllBySessaoTreinoId(id);
        List<SessaoExercicioResponseDTO> sessaoExercicioResponseDTOS = new ArrayList<>();
        for(SessaoExercicio sessaoExercicio : sessaoExercicios){
            sessaoExercicioResponseDTOS.add(new SessaoExercicioResponseDTO(sessaoExercicio.getId(), sessaoExercicio.getExercicio().getId(), sessaoExercicio.getExercicio().getNome(), sessaoExercicio.getNumSeries(), sessaoExercicio.getRepeticoesMin(), sessaoExercicio.getRepeticoesMax(), sessaoExercicio.getOrdem(), sessaoExercicio.getDescanso()));
        }
        return sessaoExercicioResponseDTOS;
    }

    public void deleteSessaoExerciciosBySessaoTreinoId(UUID id) {
        List<SessaoExercicio> sessaoExercicios = sessaoExercicioRepository.findAllBySessaoTreinoId(id);
        for (SessaoExercicio sessaoExercicio : sessaoExercicios) {
            sessaoExercicioRepository.delete(sessaoExercicio);
        }
    }
}
