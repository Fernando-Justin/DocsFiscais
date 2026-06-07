export type Trimestre = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type RoadmapStatus = 'Backlog' | 'Planejado' | 'Em andamento' | 'Em homologação' | 'Bloqueado' | 'Concluído' | 'Cancelado';

export type RoadmapCategoria =
  | 'Evolução técnica'
  | 'Exigência fiscal/regulatória'
  | 'Demanda de cliente'
  | 'Correção / Débito técnico'
  | 'Infraestrutura';

export type RoadmapPrioridade = 'Crítica' | 'Alta' | 'Média' | 'Baixa';

export interface Roadmap {
  id: string;
  application_id: string;
  atividade: string;
  detalhamento: string | null;
  categoria: RoadmapCategoria;
  prioridade: RoadmapPrioridade;
  data_prevista_inicio: string | null;
  data_prevista_finalizacao: string | null;
  trimestre: Trimestre;
  ano: number;
  status: RoadmapStatus;
  responsavel: string | null;
  observacoes: string | null;
  created_at?: string;
}
