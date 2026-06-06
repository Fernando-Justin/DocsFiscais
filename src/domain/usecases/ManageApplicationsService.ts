import { 
  ManageApplicationsUseCase, 
  ApplicationDetails, 
  ApplicationListItem 
} from '@/ports/incoming/ManageApplicationsUseCase';
import { ApplicationRepositoryPort } from '@/ports/outgoing/ApplicationRepositoryPort';
import { SubModuleRepositoryPort } from '@/ports/outgoing/SubModuleRepositoryPort';
import { EndpointRepositoryPort } from '@/ports/outgoing/EndpointRepositoryPort';
import { CollaboratorRepositoryPort } from '@/ports/outgoing/CollaboratorRepositoryPort';
import { MonitoringRepositoryPort } from '@/ports/outgoing/MonitoringRepositoryPort';
import { RoadmapRepositoryPort } from '@/ports/outgoing/RoadmapRepositoryPort';

import { Application } from '../entities/Application';
import { SubModule } from '../entities/SubModule';
import { Endpoint } from '../entities/Endpoint';
import { Collaborator } from '../entities/Collaborator';
import { Monitoring } from '../entities/Monitoring';
import { Roadmap } from '../entities/Roadmap';

export class ManageApplicationsService implements ManageApplicationsUseCase {
  constructor(
    private appRepo: ApplicationRepositoryPort,
    private submoduleRepo: SubModuleRepositoryPort,
    private endpointRepo: EndpointRepositoryPort,
    private collaboratorRepo: CollaboratorRepositoryPort,
    private monitoringRepo: MonitoringRepositoryPort,
    private roadmapRepo: RoadmapRepositoryPort
  ) {}

  async getApplicationsList(): Promise<ApplicationListItem[]> {
    const apps = await this.appRepo.findAll();
    const items: ApplicationListItem[] = [];
    
    for (const app of apps) {
      const monitoring = await this.monitoringRepo.findByApplicationId(app.id);
      items.push({
        ...app,
        monitoring
      });
    }
    
    return items;
  }

  async getApplicationDetails(id: string): Promise<ApplicationDetails> {
    const application = await this.appRepo.findById(id);
    if (!application) {
      throw new Error(`Aplicação com ID ${id} não encontrada.`);
    }

    const [subModules, endpoints, collaborators, monitoring, roadmap] = await Promise.all([
      this.submoduleRepo.findByApplicationId(id),
      this.endpointRepo.findByApplicationId(id),
      this.collaboratorRepo.findByApplicationId(id),
      this.monitoringRepo.findByApplicationId(id),
      this.roadmapRepo.findByApplicationId(id)
    ]);

    return {
      application,
      subModules,
      endpoints,
      collaborators,
      monitoring,
      roadmap
    };
  }

  async createApplication(application: Omit<Application, 'id'>): Promise<Application> {
    return this.appRepo.save(application);
  }

  async updateApplication(id: string, application: Partial<Application>): Promise<Application> {
    const existing = await this.appRepo.findById(id);
    if (!existing) {
      throw new Error(`Aplicação com ID ${id} não encontrada para atualização.`);
    }
    return this.appRepo.save({ ...existing, ...application, id });
  }

  async deleteApplication(id: string): Promise<boolean> {
    return this.appRepo.delete(id);
  }

  async saveSubModule(subModule: Omit<SubModule, 'id'> & { id?: string }): Promise<SubModule> {
    return this.submoduleRepo.save(subModule);
  }

  async deleteSubModule(id: string): Promise<boolean> {
    return this.submoduleRepo.delete(id);
  }

  async saveEndpoint(endpoint: Omit<Endpoint, 'id'> & { id?: string }): Promise<Endpoint> {
    return this.endpointRepo.save(endpoint);
  }

  async deleteEndpoint(id: string): Promise<boolean> {
    return this.endpointRepo.delete(id);
  }

  async getCollaborators(): Promise<Collaborator[]> {
    return this.collaboratorRepo.findAll();
  }

  async saveCollaborator(collaborator: Omit<Collaborator, 'id'> & { id?: string }): Promise<Collaborator> {
    return this.collaboratorRepo.save(collaborator);
  }

  async associateCollaborator(applicationId: string, collaboratorId: string): Promise<boolean> {
    return this.collaboratorRepo.associateToApplication(applicationId, collaboratorId);
  }

  async dissociateCollaborator(applicationId: string, collaboratorId: string): Promise<boolean> {
    return this.collaboratorRepo.dissociateFromApplication(applicationId, collaboratorId);
  }

  async deleteCollaborator(id: string): Promise<boolean> {
    return this.collaboratorRepo.delete(id);
  }

  async saveMonitoring(monitoring: Omit<Monitoring, 'id'> & { id?: string }): Promise<Monitoring> {
    return this.monitoringRepo.save(monitoring);
  }

  async saveRoadmapItem(roadmap: Omit<Roadmap, 'id'> & { id?: string }): Promise<Roadmap> {
    return this.roadmapRepo.save(roadmap);
  }

  async deleteRoadmapItem(id: string): Promise<boolean> {
    return this.roadmapRepo.delete(id);
  }
}
