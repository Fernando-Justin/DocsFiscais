import { Stack } from '@/domain/entities/Stack';

export interface StackRepositoryPort {
  findByApplicationId(applicationId: string): Promise<Stack[]>;
  save(stack: Omit<Stack, 'id'> & { id?: string }): Promise<Stack>;
  delete(id: string): Promise<boolean>;
}
