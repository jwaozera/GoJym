package br.com.p3.GoJym.repository;

import br.com.p3.GoJym.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    UserDetails findByEmail(String email);
}
