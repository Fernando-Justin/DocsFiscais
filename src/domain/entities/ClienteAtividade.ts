export type AtividadeStatus = 'Pendente' | 'Em Andamento' | 'Concluída' | 'Bloqueada';

export interface ClienteAtividade {
  id: string;
  cliente_id: string;
  descritivo: string;
  status: AtividadeStatus;
  data_prevista_inicio: string | null;
  data_prevista_conclusao: string | null;
  created_at?: string;
}
