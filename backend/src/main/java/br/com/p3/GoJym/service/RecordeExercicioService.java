package br.com.p3.GoJym.service;

import br.com.p3.GoJym.dto.RecordeExercicioResponseDTO;
import br.com.p3.GoJym.exceptions.ExercicioNaoEncontradoException;
import br.com.p3.GoJym.model.RecordeExercicio;
import br.com.p3.GoJym.model.RegistroSerie;
import br.com.p3.GoJym.repository.RecordeExercicioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RecordeExercicioService {

    private final RecordeExercicioRepository recordeExercicioRepository;

    public RecordeExercicioService(RecordeExercicioRepository recordeExercicioRepository) {
        this.recordeExercicioRepository = recordeExercicioRepository;
    }

    public RecordeExercicioResponseDTO getRecordeExercicioByExercicio(Long exercicioId, UUID id) {
        RecordeExercicio recordeExercicio = recordeExercicioRepository.findRecordeExercicioByExercicioIdAndUsuarioId(exercicioId, id).orElse(null);
        if (recordeExercicio==null){
            return null;
        }

        return new RecordeExercicioResponseDTO(recordeExercicio.getMaiorCarga(), recordeExercicio.getMaiorVolume(), recordeExercicio.getMaiorCargaUpdatedAt(), recordeExercicio.getMaiorVolumeUpdatedAt());
    }

    public boolean verificarRecorde(RegistroSerie registroSerieSalva) {
        RecordeExercicio recordeExercicio = recordeExercicioRepository
                .findRecordeExercicioByExercicioIdAndUsuarioId(registroSerieSalva.getExercicio()
                        .getId(),registroSerieSalva.
                        getRegistroTreino().getUsuario().getId()).orElse(null);
        boolean aux=false;
        if(recordeExercicio==null){
            recordeExercicio=new RecordeExercicio();
            recordeExercicio.setExercicio(registroSerieSalva.getExercicio());
            recordeExercicio.setUsuario(registroSerieSalva.getRegistroTreino().getUsuario());

            recordeExercicio.setMaiorCarga(registroSerieSalva.getCarga());
            recordeExercicio.setMaiorCargaUpdatedAt(LocalDateTime.now());
            recordeExercicio.setMaiorVolume(registroSerieSalva.getCarga()*registroSerieSalva.getRepeticoes());
            recordeExercicio.setMaiorVolumeUpdatedAt(LocalDateTime.now());
            recordeExercicioRepository.save(recordeExercicio);
            return true;
        }
        float volume = registroSerieSalva.getCarga() * registroSerieSalva.getRepeticoes();
        if(volume>recordeExercicio.getMaiorVolume()){
            recordeExercicio.setMaiorVolume(volume);
            recordeExercicio.setMaiorVolumeUpdatedAt(LocalDateTime.now());
            recordeExercicioRepository.save(recordeExercicio);
            aux=true;
        }
        if(registroSerieSalva.getCarga()>recordeExercicio.getMaiorCarga()){
            recordeExercicio.setMaiorCarga(registroSerieSalva.getCarga());
            recordeExercicio.setMaiorCargaUpdatedAt(LocalDateTime.now());
            recordeExercicioRepository.save(recordeExercicio);
            aux=true;
        }
        return aux;
    }
}
