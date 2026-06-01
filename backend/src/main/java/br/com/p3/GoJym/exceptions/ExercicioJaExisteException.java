package br.com.p3.GoJym.exceptions;

public class ExercicioJaExisteException extends RuntimeException {
    public ExercicioJaExisteException(){
        super("Exercício com esse nome ja existe no banco de dados.");
    }
}
