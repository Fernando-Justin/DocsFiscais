export interface Application {
  id: string;
  nome: string;
  proposito: string | null;
  escopo: string | null;
  ambiente_hml: string | null;
  ambiente_prd: string | null;
  link_confluence: string | null;
  created_at?: string;
}
