export type AtividadeStatus = 'Pendente' | 'Em análise' | 'Em desenvolvimento' | 'Concluído' | 'Recusado';

export interface ClienteAtividade {
  id: string;
  cliente_id: string;
  descritivo: string;
  status: AtividadeStatus;
  data_prevista_inicio: string | null;
  data_prevista_conclusao: string | null;
  observacao: string | null;
  created_at?: string;
}
