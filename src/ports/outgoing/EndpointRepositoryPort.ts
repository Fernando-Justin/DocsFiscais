import { Endpoint } from '@/domain/entities/Endpoint';

export interface EndpointRepositoryPort {
  findByApplicationId(applicationId: string): Promise<Endpoint[]>;
  save(endpoint: Omit<Endpoint, 'id'> & { id?: string }): Promise<Endpoint>;
  delete(id: string): Promise<boolean>;
}
