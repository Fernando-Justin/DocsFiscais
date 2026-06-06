import { Application } from '@/domain/entities/Application';

export interface ApplicationRepositoryPort {
  findAll(): Promise<Application[]>;
  findById(id: string): Promise<Application | null>;
  save(application: Omit<Application, 'id'> & { id?: string }): Promise<Application>;
  delete(id: string): Promise<boolean>;
}
