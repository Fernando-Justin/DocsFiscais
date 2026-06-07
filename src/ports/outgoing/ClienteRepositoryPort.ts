import { Cliente } from '@/domain/entities/Cliente';

export interface ClienteRepositoryPort {
  findByApplicationId(applicationId: string): Promise<Cliente[]>;
  save(cliente: Omit<Cliente, 'id'> & { id?: string }): Promise<Cliente>;
  delete(id: string): Promise<boolean>;
}
