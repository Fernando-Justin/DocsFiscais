export interface Monitoring {
  id: string;
  application_id: string;
  grafana_url: string | null;
  datadog_url: string | null;
  created_at?: string;
}
