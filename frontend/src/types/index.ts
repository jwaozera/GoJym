// ===== Usuário =====
export interface Usuario {
  id: string
  nome: string
  email: string
  createdAt: string
}

// Compatibilidade com nomenclatura usada no front
export interface User {
  id: string
  name: string
  email: string
}

export interface UsuarioRegistro extends Omit<Usuario, 'id' | 'createdAt'> {
  senha: string
}

// ===== Exercício =====
export interface Exercicio {
  id: number
  nome: string
}

export interface ExercicioDTO extends Exercicio { }

export interface ExercicioRequestDTO {
  nome: string
}

// Type alias para compatibilidade
export type Exercise = Exercicio

// ===== Sessão de Treino =====
export interface SessaoTreino {
  id: string
  nome: string
  createdAt: string
  qtdExercicios?: number
}

export interface SessaoTreinoDTO extends SessaoTreino { }

export interface CreateSessaoTreinoRequestDTO {
  nome: string
}

export interface EditSessaoTreinoRequestDTO {
  nome: string
}

// DTO para criar sessão com exercícios (formato simplificado)
export interface ExercicioSessaoRequestDTO {
  exercicioId: number
  series: number
  repsMin: number
  repsMax: number
  descanso: number
  ordem: number
}

// DTO para atualizar sessão com exercícios (permite id opcional para identificar exercícios existentes)
export interface ExercicioSessaoUpdateRequestDTO extends ExercicioSessaoRequestDTO {
  id?: string
}

export interface CreateSessaoTreinoComExerciciosRequestDTO {
  nome: string
  exercicios: ExercicioSessaoRequestDTO[]
}

export interface UpdateSessaoTreinoComExerciciosRequestDTO {
  nome: string
  exercicios: ExercicioSessaoUpdateRequestDTO[]
}

export interface CreateSessaoTreinoResponseDTO {
  id: string
  nome: string
  createdAt: string
}

export interface EditSessaoTreinoResponseDTO {
  id: string
  nome: string
  createdAt: string
}

// ===== Sessão de Exercício =====
export interface SessaoExercicio {
  id: string
  exercicioId: number
  exercicioNome: string
  numSeries: number
  repeticoesMin: number
  repeticoesMax: number
  ordem: number
  descanso: number
}

export interface SessaoExercicioResponseDTO extends SessaoExercicio { }

export interface SessaoExercicioRequestDTO {
  exercicioId: number
  numSeries: number
  repeticoesMin: number
  repeticoesMax: number
  ordem: number
  descanso?: number
}

export interface EditSessaoExercicioRequestDTO extends SessaoExercicioRequestDTO { }

// ===== Sessão de Treino Especificada (com exercícios) =====
export interface SessaoTreinoEspDTO {
  id: string
  nome: string
  createdAt: string
  exercicios: SessaoExercicioResponseDTO[]
}

// ===== Registro de Treino (Histórico) =====
export interface RegistroTreino {
  id: string
  usuarioId: string
  sessaoTreinoId: string
  data: string
  concluido: boolean
  duracaoSegundos?: number
  cargaTotal?: number
}

// ===== Registro de Série (Histórico detalhado) =====
export interface RegistroSerie {
  id: string
  registroTreinoId: string
  exercicioId: number
  numeroSerie: number
  carga: number
  repeticoes: number
}

// ===== Recordes =====
export interface RecordeExercicio {
  id: string
  usuarioId: string
  exercicioId: number
  maiorCarga: number
  maiorRepeticao: number
}

export interface RecordeSessao {
  id: string
  usuarioId: string
  sessaoTreinoId: string
  menorTempo: number
  maiorCargaTotal: number
}

// ===== Tipos auxiliares (para compatibilidade) =====
export interface Set {
  id: string
  setNumber: number
  // weight/reps podem ser strings vindas da UI ou números; aceitar ambos
  weight: string | number | null
  reps: string | number | null
  completed: boolean
}

export interface WorkoutExercise {
  id: string
  exercicio: Exercicio
  // Compatibilidade com formato usado nas telas
  exercicioId?: number
  exercicioNome?: string
  numSeries?: number
  repeticoesMin?: number
  repeticoesMax?: number
  ordem?: number
  sets: Set[]
  descanso?: number
}

export interface ExercicioSessao extends SessaoExercicio { }

export interface WorkoutSession extends SessaoTreino {
  // Compatibilidade temporária entre campos em português e inglês
  // Nome do treino
  name?: string
  // Alias em português já existe via `nome` em SessaoTreino

  // Lista de exercícios — suportar ambos os formatos usados nas telas
  exercises?: WorkoutExercise[]
  exercicios?: WorkoutExercise[]

  // Data de conclusão (ISO string)
  completedAt?: string | null

  // Flag de sessão ativa
  isActive?: boolean

  // Quantidade de exercícios (compatibilidade)
  qtdExercicios?: number
}

// ===== Auth =====
export interface AuthDTO {
  email: string
  senha: string
}

export interface RegisterDTO {
  nome: string
  email: string
  senha: string
}
