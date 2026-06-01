package br.com.p3.GoJym.repository;

import br.com.p3.GoJym.dto.SessaoTreinoDTO;
import br.com.p3.GoJym.model.SessaoTreino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SessaoTreinoRepository extends JpaRepository<SessaoTreino, UUID> {

    @Query("SELECT new br.com.p3.GoJym.dto.SessaoTreinoDTO(st.id, st.nome, st.createdAt, CAST(COUNT(se) AS int)) " +
           "FROM SessaoTreino st " +
           "LEFT JOIN SessaoExercicio se ON st.id = se.sessaoTreino.id " +
           "WHERE st.usuario.id = :usuarioId " +
           "GROUP BY st.id, st.nome, st.createdAt")
    List<SessaoTreinoDTO> findAllByUsuarioId(@Param("usuarioId") UUID usuarioId);

    SessaoTreino save(SessaoTreino sessaoTreino);

    Optional<SessaoTreino> findByNome(String nome);

    Optional<SessaoTreino> findById(UUID id);

    Optional<SessaoTreino> findByNomeAndUsuarioId(String nome, UUID id);
}
