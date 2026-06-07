export type ClienteStatus = 'Ativo' | 'Bloqueado' | 'Inativo' | 'Em Homologação';

export interface Cliente {
  id: string;
  application_id: string;
  area_referencia: string;
  contato: string;
  status: ClienteStatus;
  created_at?: string;
}
