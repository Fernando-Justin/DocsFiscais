export interface MonitoringLink {
  id: string;
  application_id: string;
  nome: string;
  url: string;
  descricao: string | null;
  responsavel: string | null;
  created_at?: string;
}

export interface Monitoring {
  id: string;
  application_id: string;
  grafana_url: string | null;
  datadog_url: string | null;
  links: MonitoringLink[];
  created_at?: string;
}
