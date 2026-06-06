import { Collaborator } from '@/domain/entities/Collaborator';

export interface CollaboratorRepositoryPort {
  findAll(): Promise<Collaborator[]>;
  findByApplicationId(applicationId: string): Promise<Collaborator[]>;
  save(collaborator: Omit<Collaborator, 'id' | 'application_ids'> & { id?: string }): Promise<Collaborator>;
  associateToApplication(applicationId: string, collaboratorId: string): Promise<boolean>;
  dissociateFromApplication(applicationId: string, collaboratorId: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
