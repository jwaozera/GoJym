package br.com.p3.GoJym.controller;

import br.com.p3.GoJym.dto.AuthDTO;
import br.com.p3.GoJym.dto.RegisterDTO;
import br.com.p3.GoJym.model.Usuario;
import br.com.p3.GoJym.repository.UsuarioRepository;
import br.com.p3.GoJym.security.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final TokenService tokenService;

    public AuthController(AuthenticationManager authenticationManager, UsuarioRepository usuarioRepository, TokenService tokenService){
        this.authenticationManager=authenticationManager;
        this.usuarioRepository=usuarioRepository;
        this.tokenService = tokenService;
    }


    @PostMapping("/login")
    public ResponseEntity Login(@RequestBody AuthDTO data){
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getSenhaHash());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        Usuario usuarioAutenticado = (Usuario) auth.getPrincipal();
        var token = tokenService.generateToken(usuarioAutenticado.getEmail());

        return ResponseEntity.ok(token);
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterDTO data){
        if(usuarioRepository.findByEmail(data.getEmail())!=null){
            return ResponseEntity.badRequest().body("Email ja cadastrado");
        }

        String encryptedPassword= new BCryptPasswordEncoder().encode(data.getSenhaHash());
        Usuario novoUsuario= new Usuario(data.getNome(), data.getEmail(), encryptedPassword);
        usuarioRepository.save(novoUsuario);
        return ResponseEntity.ok().build();
    }
}
