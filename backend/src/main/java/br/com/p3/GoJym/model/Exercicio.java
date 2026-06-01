package br.com.p3.GoJym.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exercicio")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Exercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column( updatable = false)
    private Long id;

    @Column(nullable = false)
    private String nome;

}
