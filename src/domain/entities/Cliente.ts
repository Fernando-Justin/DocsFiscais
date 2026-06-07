export type ClienteStatus = 'Ativo' | 'Em Homologação' | 'Bloqueado' | 'Inativo';

export interface ClienteEndpoint {
  endpoint_id: string;
  observacao: string | null;
}

export interface Cliente {
  id: string;
  application_id: string;
  nome_empresa: string;
  area_referencia: string;
  contato: string;
  status: ClienteStatus;
  endpoints: ClienteEndpoint[];
  created_at?: string;
}
