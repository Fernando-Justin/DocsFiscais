export type ConfluenceCategoria =
  | 'Arquitetura'
  | 'Manual do usuário'
  | 'Processo'
  | 'Runbook'
  | 'ADR'
  | 'Outro';

export interface ConfluenceReference {
  id: string;
  application_id: string;
  titulo: string;
  url: string;
  categoria: ConfluenceCategoria;
  descricao: string | null;
  ultima_atualizacao: string | null;
  created_at?: string;
}
