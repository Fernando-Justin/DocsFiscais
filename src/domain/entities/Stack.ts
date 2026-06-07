export type StackCategoria = 'linguagem' | 'framework' | 'banco_dados';
export type StackStatus = 'Em Uso' | 'Em Migração' | 'Descontinuado' | 'Em Avaliação';

export interface Stack {
  id: string;
  application_id: string;
  nome: string;
  versao: string;
  categoria: StackCategoria;
  status: StackStatus;
  observacao: string | null;
  created_at?: string;
}
