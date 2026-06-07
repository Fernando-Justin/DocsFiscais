export type ColaboradorPapel =
  | 'Desenvolvedor'
  | 'Tech Lead'
  | 'Arquiteto'
  | 'DevOps'
  | 'QA'
  | 'Suporte NOC'
  | 'PO'
  | 'Outro';

export type ColaboradorStatus = 'Ativo' | 'Inativo' | 'Temporário';

export interface Collaborator {
  id: string;
  nome: string;
  squad: string;
  papel: ColaboradorPapel;
  email: string;
  contato: string | null;
  status: ColaboradorStatus;
  nivel_acesso: string | null;
  created_at?: string;
  application_ids?: string[];
}
