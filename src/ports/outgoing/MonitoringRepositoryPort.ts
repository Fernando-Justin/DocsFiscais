import { Monitoring } from '@/domain/entities/Monitoring';

export interface MonitoringRepositoryPort {
  findByApplicationId(applicationId: string): Promise<Monitoring | null>;
  save(monitoring: Omit<Monitoring, 'id'> & { id?: string }): Promise<Monitoring>;
  deleteByApplicationId(applicationId: string): Promise<boolean>;
}
