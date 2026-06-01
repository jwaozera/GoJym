package br.com.p3.GoJym.exceptions;

public class ExercicioNaoEncontradoException extends RuntimeException {
    public ExercicioNaoEncontradoException() {
        super("Exercício não foi encontrado.");
    }
}
