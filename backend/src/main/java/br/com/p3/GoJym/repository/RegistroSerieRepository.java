package br.com.p3.GoJym.repository;

import br.com.p3.GoJym.model.RegistroSerie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface RegistroSerieRepository extends JpaRepository<RegistroSerie, UUID> {
    RegistroSerie save(RegistroSerie registroSerie);

    List<RegistroSerie> findByRegistroTreinoId(UUID registroTreinoId);
    List<RegistroSerie> findByRegistroTreinoIdIn(List<UUID> registroTreinoIds);

    @Query("SELECT rt.data, COUNT(rs) " +
            "FROM RegistroSerie rs JOIN rs.registroTreino rt " +
            "WHERE rt.usuario.id = :usuarioId AND rt.data BETWEEN :start AND :end " +
            "GROUP BY rt.data")
    List<Object[]> countSeriesByUsuarioBetweenDates(@Param("usuarioId") UUID usuarioId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT rs FROM RegistroSerie rs " +
            "JOIN rs.registroTreino rt " +
            "WHERE rt.usuario.id = :usuarioId AND rs.exercicio.id = :exercicioId " +
            "ORDER BY rs.registroTreino.data DESC, rs.id DESC")
    List<RegistroSerie> getUltimasSeriesByUsuarioAndExercicio(@Param("usuarioId") UUID usuarioId, @Param("exercicioId") Long exercicioId);

}
