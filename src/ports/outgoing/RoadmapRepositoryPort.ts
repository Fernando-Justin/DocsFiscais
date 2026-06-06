import { Roadmap } from '@/domain/entities/Roadmap';

export interface RoadmapRepositoryPort {
  findByApplicationId(applicationId: string): Promise<Roadmap[]>;
  save(roadmap: Omit<Roadmap, 'id'> & { id?: string }): Promise<Roadmap>;
  delete(id: string): Promise<boolean>;
}
