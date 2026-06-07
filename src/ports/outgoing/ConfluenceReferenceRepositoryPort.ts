import { ConfluenceReference } from '@/domain/entities/ConfluenceReference';

export interface ConfluenceReferenceRepositoryPort {
  findByApplicationId(applicationId: string): Promise<ConfluenceReference[]>;
  save(ref: Omit<ConfluenceReference, 'id'> & { id?: string }): Promise<ConfluenceReference>;
  delete(id: string): Promise<boolean>;
}
