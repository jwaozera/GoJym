package br.com.p3.GoJym.service;

import br.com.p3.GoJym.dto.*;
import br.com.p3.GoJym.exceptions.SessaoTreinoJaExisteException;
import br.com.p3.GoJym.exceptions.SessaoTreinoNaoEncontradoException;
import br.com.p3.GoJym.exceptions.UsuarioNaoEncontradoException;
import br.com.p3.GoJym.model.SessaoTreino;
import br.com.p3.GoJym.model.Usuario;
import br.com.p3.GoJym.repository.SessaoTreinoRepository;
import br.com.p3.GoJym.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SessaoTreinoService {
    private final SessaoTreinoRepository sessaoTreinoRepository;
    private final UsuarioRepository usuarioRepository;
    private final SessaoExercicioService sessaoExercicioService;



    public SessaoTreinoService(
            SessaoTreinoRepository sessaoTreinoRepository,
            UsuarioRepository usuarioRepository,
            SessaoExercicioService sessaoExercicioService) {
        this.sessaoTreinoRepository = sessaoTreinoRepository;
        this.usuarioRepository = usuarioRepository;
        this.sessaoExercicioService=sessaoExercicioService;
    }

    public List<SessaoTreinoDTO> listAllSessaoTreinoByUserId(UUID id){
        return sessaoTreinoRepository.findAllByUsuarioId(id);
    }


    public CreateSessaoTreinoResponseDTO createSessaoTreino(UUID id, CreateSessaoTreinoRequestDTO requestDTO) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario==null){
            throw new UsuarioNaoEncontradoException();
        }
        SessaoTreino sessaoTreino = sessaoTreinoRepository.findByNomeAndUsuarioId(requestDTO.getNome(),id).orElse(null);
        List<SessaoExercicioResponseDTO> exerciciosResponseDTO;
        if(sessaoTreino==null){
            sessaoTreino = new SessaoTreino();
            sessaoTreino.setNome(requestDTO.getNome());
            sessaoTreino.setUsuario(usuario);
            SessaoTreino sessaoSalva=sessaoTreinoRepository.save(sessaoTreino);

            exerciciosResponseDTO=sessaoExercicioService.createSessoesExercicio(requestDTO.getExercicios(), sessaoSalva);
        }else{
            throw new SessaoTreinoJaExisteException();
        }

        return new CreateSessaoTreinoResponseDTO(sessaoTreino.getId(), sessaoTreino.getNome(), exerciciosResponseDTO, sessaoTreino.getCreatedAt());
    }

    public void deleteSessaoTreino(UUID id){
        SessaoTreino sessaoTreino=sessaoTreinoRepository.findById(id).orElse(null);
        if(sessaoTreino==null){
            throw new SessaoTreinoNaoEncontradoException();
        }
        sessaoExercicioService.deleteSessaoExerciciosBySessaoTreinoId(id);
        sessaoTreinoRepository.delete(sessaoTreino);
    }

    public EditSessaoTreinoResponseDTO editSessaoTreino(UUID id, EditSessaoTreinoRequestDTO editSessaoTreinoDTO){
        SessaoTreino sessaoTreino=sessaoTreinoRepository.findById(id).orElse(null);
        if(sessaoTreino==null){
            throw new SessaoTreinoNaoEncontradoException();
        }
        sessaoTreino.setNome(editSessaoTreinoDTO.getNome());
        SessaoTreino sessaoTreinoEditada = sessaoTreinoRepository.save(sessaoTreino);

        List<SessaoExercicioResponseDTO> exercicios = sessaoExercicioService.editSessaoExercicios(editSessaoTreinoDTO.getExercicios(), sessaoTreino);
        return new EditSessaoTreinoResponseDTO(sessaoTreinoEditada.getId(),sessaoTreinoEditada.getNome(), exercicios);
    }

    public SessaoTreinoEspDTO getSessaoTreinoById(UUID id){
        SessaoTreino sessaoTreino=sessaoTreinoRepository.findById(id).orElseThrow(SessaoTreinoNaoEncontradoException::new);
        List<SessaoExercicioResponseDTO> exercicios = sessaoExercicioService.getSessaoExerciciosBySessaoTreinoId(id);
        return new SessaoTreinoEspDTO(sessaoTreino.getId(), sessaoTreino.getNome(), sessaoTreino.getCreatedAt(), exercicios);
    }


}





