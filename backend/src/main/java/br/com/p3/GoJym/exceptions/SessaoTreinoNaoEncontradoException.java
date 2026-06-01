package br.com.p3.GoJym.exceptions;

public class SessaoTreinoNaoEncontradoException extends RuntimeException {
    public SessaoTreinoNaoEncontradoException() {
        super("Sessão de treino não encontrada.");
    }

}
