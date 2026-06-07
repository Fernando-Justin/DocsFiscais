import { Ocorrencia } from '@/domain/entities/Ocorrencia';

export interface OcorrenciaRepositoryPort {
  findByApplicationId(applicationId: string): Promise<Ocorrencia[]>;
  save(ocorrencia: Omit<Ocorrencia, 'id'> & { id?: string }): Promise<Ocorrencia>;
  delete(id: string): Promise<boolean>;
}
