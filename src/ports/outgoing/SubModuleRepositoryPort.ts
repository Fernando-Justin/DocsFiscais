import { SubModule } from '@/domain/entities/SubModule';

export interface SubModuleRepositoryPort {
  findByApplicationId(applicationId: string): Promise<SubModule[]>;
  save(subModule: Omit<SubModule, 'id'> & { id?: string }): Promise<SubModule>;
  delete(id: string): Promise<boolean>;
}
