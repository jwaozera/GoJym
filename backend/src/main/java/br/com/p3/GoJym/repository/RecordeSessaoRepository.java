package br.com.p3.GoJym.repository;

import br.com.p3.GoJym.model.RecordeSessao;
import br.com.p3.GoJym.model.RecordeSessaoTipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RecordeSessaoRepository extends JpaRepository<RecordeSessao, UUID> {
    Optional<RecordeSessao> findByUsuarioIdAndTipo(UUID usuarioId, RecordeSessaoTipo tipo);
    // retorna o recorde mais recente (por updatedAt) para um usuário e tipo
    Optional<RecordeSessao> findTopByUsuarioIdAndTipoOrderByUpdatedAtDesc(UUID usuarioId, RecordeSessaoTipo tipo);
}
