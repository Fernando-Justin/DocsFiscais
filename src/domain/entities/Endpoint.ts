export interface Endpoint {
  id: string;
  application_id: string;
  submodule_id: string | null;
  metodo: string; // GET, POST, PUT, DELETE, etc.
  path: string;
  descricao: string | null;
  payload_exemplo: string | null; // JSON formatado em string
  comando_curl: string | null;
  created_at?: string;
}
