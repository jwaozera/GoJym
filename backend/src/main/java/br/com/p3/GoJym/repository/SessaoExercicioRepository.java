package br.com.p3.GoJym.repository;

import br.com.p3.GoJym.model.SessaoExercicio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SessaoExercicioRepository extends JpaRepository<SessaoExercicio, UUID> {
    List<SessaoExercicio> findAllBySessaoTreinoId(UUID id);
}

