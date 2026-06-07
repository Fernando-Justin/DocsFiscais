export type StackCategoria =
  | 'Linguagem'
  | 'Framework'
  | 'Banco de Dados'
  | 'Infraestrutura'
  | 'Mensageria'
  | 'Observabilidade'
  | 'Segurança'
  | 'Outro';

export type StackStatus = 'Ativo' | 'Em atualização' | 'Depreciado' | 'Em avaliação';

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
