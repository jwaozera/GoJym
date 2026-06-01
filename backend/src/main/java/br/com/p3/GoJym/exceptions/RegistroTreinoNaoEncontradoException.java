package br.com.p3.GoJym.exceptions;

import br.com.p3.GoJym.service.RegistroTreinoService;

public class RegistroTreinoNaoEncontradoException extends RuntimeException {
    public RegistroTreinoNaoEncontradoException(){
        super("Registro de treino não foi encontrado");
    }
}
