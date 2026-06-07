export interface EndpointParametro {
  nome: string;
  tipo: string;
  obrigatorio: boolean;
  descricao: string;
}

export type EndpointStatus = 'Ativo' | 'Depreciado' | 'Em desenvolvimento';

export type AmbienteDisponivel = 'Produção' | 'Homologação' | 'Ambos';

export interface Endpoint {
  id: string;
  application_id: string;
  submodule_id: string | null;
  metodo: string;
  path: string;
  descricao: string | null;
  parametros: string | null;
  payload_exemplo: string | null;
  exemplo_response: string | null;
  status_codes: string | null;
  auth_exigida: boolean;
  auth_tipo: string | null;
  ambiente_disponivel: AmbienteDisponivel;
  status: EndpointStatus;
  comando_curl: string | null;
  created_at?: string;
}
