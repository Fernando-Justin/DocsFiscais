export type Trimestre = 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type RoadmapStatus = 'Backlog' | 'In Progress' | 'Done';

export interface Roadmap {
  id: string;
  application_id: string;
  atividade: string;
  trimestre: Trimestre;
  ano: number;
  status: RoadmapStatus;
  created_at?: string;
}
