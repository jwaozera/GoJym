package br.com.p3.GoJym.exceptions;

public class SessaoTreinoJaExisteException extends RuntimeException {
    public SessaoTreinoJaExisteException(){
        super("Sessão de treino com esse nome ja existe no banco de dados.");
    }
}
