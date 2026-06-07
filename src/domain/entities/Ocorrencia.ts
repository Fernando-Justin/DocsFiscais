export type OcorrenciaTipo =
  | 'Indisponibilidade total'
  | 'Degradação de performance'
  | 'Erro funcional'
  | 'Alerta de monitoramento'
  | 'Manutenção programada';

export type OcorrenciaAmbiente = 'Produção' | 'Homologação' | 'Ambos';

export type OcorrenciaOfensor =
  | 'Banco de dados'
  | 'Infraestrutura / Cloud'
  | 'Código da aplicação'
  | 'Integração externa'
  | 'Rede'
  | 'Deploy / Release'
  | 'Não identificado'
  | 'Outro';

export type OcorrenciaStatus = 'Em andamento' | 'Normalizado' | 'Monitorando';

export interface Ocorrencia {
  id: string;
  application_id: string;
  titulo: string;
  tipo: OcorrenciaTipo;
  ambiente: OcorrenciaAmbiente;
  ofensor: OcorrenciaOfensor;
  ofensor_outro: string | null;
  data_hora_inicio: string;
  data_hora_normalizacao: string | null;
  tempo_total_minutos: number | null;
  status: OcorrenciaStatus;
  acoes_tomadas: string | null;
  observacoes: string | null;
  registrado_por: string | null;
  created_at?: string;
}
