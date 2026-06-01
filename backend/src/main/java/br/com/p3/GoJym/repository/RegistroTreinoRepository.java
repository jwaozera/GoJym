package br.com.p3.GoJym.repository;

import br.com.p3.GoJym.model.RegistroTreino;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface RegistroTreinoRepository extends JpaRepository<RegistroTreino, UUID> {
    RegistroTreino save(RegistroTreino registroTreino);
    List<RegistroTreino> findAllByUsuarioIdAndDataBetween(UUID usuarioId, LocalDate start, LocalDate end);
}
