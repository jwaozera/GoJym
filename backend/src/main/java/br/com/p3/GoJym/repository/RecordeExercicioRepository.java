package br.com.p3.GoJym.repository;

import br.com.p3.GoJym.model.RecordeExercicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;


public interface RecordeExercicioRepository extends JpaRepository<RecordeExercicio, UUID> {
    @Query("SELECT r FROM RecordeExercicio r WHERE r.exercicio.id = :exercicioId AND r.usuario.id = :usuarioId ORDER BY r.id DESC LIMIT 1")
    Optional<RecordeExercicio> findRecordeExercicioByExercicioIdAndUsuarioId(@Param("exercicioId") Long exercicioId, @Param("usuarioId") UUID usuarioId);
}
