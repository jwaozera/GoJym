package br.com.p3.GoJym.service;

import br.com.p3.GoJym.dto.ExercicioDTO;
import br.com.p3.GoJym.exceptions.ExercicioJaExisteException;
import br.com.p3.GoJym.exceptions.ExercicioNaoEncontradoException;
import br.com.p3.GoJym.model.Exercicio;
import br.com.p3.GoJym.repository.ExercicioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class ExercicioService {
    private final ExercicioRepository exercicioRepository;

    public ExercicioService(br.com.p3.GoJym.repository.ExercicioRepository exercicioRepository) {
        this.exercicioRepository = exercicioRepository;
    }

    public List<ExercicioDTO> listAllExercicios() {
        return exercicioRepository.findAll().stream()
                .map(exercicio -> {
                    return new ExercicioDTO(exercicio.getId(),exercicio.getNome());
                })
                .collect(toList());
    }
        public ExercicioDTO createExercicio(String nome){
            Exercicio exercicioProcurado= exercicioRepository.findByNome(nome).orElse(null);
            if(exercicioProcurado!=null){
                throw new ExercicioJaExisteException();
            }else{
                Exercicio exercicio = new Exercicio();
                exercicio.setNome(nome);
                Exercicio exercicioSalvo=exercicioRepository.save(exercicio);

                return new ExercicioDTO(exercicioSalvo.getId(), exercicioSalvo.getNome());
            }

        }

    public void deleteExercicio(Long id) {
        Exercicio exercicio = exercicioRepository.findById(id).orElse(null);
        if (exercicio != null) {
            exercicioRepository.deleteById(id);
        }else{
            throw new ExercicioNaoEncontradoException();
        }
    }
    public ExercicioDTO updateExercicio(String nome, Long id){
        Exercicio exercicio = exercicioRepository.findById(id).orElse(null);
        if(exercicio==null){
            throw new ExercicioNaoEncontradoException();
        }else{
            Exercicio exercicioProcurado = exercicioRepository.findByNome(nome).orElse(null);
            if(exercicioProcurado!=null){
                throw new ExercicioJaExisteException();
            }
            exercicio.setNome(nome);
            Exercicio exercicioSalvo=exercicioRepository.save(exercicio);
            return new ExercicioDTO(exercicioSalvo.getId(), exercicioSalvo.getNome());
        }
    }
}
