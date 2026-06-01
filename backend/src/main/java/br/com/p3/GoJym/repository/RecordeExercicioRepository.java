package br.com.p3.GoJym.repository;

import br.com.p3.GoJym.model.RecordeExercicio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;


public interface RecordeExercicioRepository extends JpaRepository<RecordeExercicio, UUID> {
    Optional<RecordeExercicio> findRecordeExercicioByExercicioIdAndUsuarioId(Long exercicioId, UUID id);
}
