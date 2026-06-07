import { Application } from '@/domain/entities/Application';
import { SubModule } from '@/domain/entities/SubModule';
import { Endpoint } from '@/domain/entities/Endpoint';
import { Collaborator } from '@/domain/entities/Collaborator';
import { Monitoring } from '@/domain/entities/Monitoring';
import { Roadmap } from '@/domain/entities/Roadmap';
import { Stack } from '@/domain/entities/Stack';
import { Cliente } from '@/domain/entities/Cliente';
import { ClienteAtividade } from '@/domain/entities/ClienteAtividade';
import { Ocorrencia } from '@/domain/entities/Ocorrencia';
import { ConfluenceReference } from '@/domain/entities/ConfluenceReference';

export interface ApplicationDetails {
  application: Application;
  subModules: SubModule[];
  endpoints: Endpoint[];
  collaborators: Collaborator[];
  monitoring: Monitoring | null;
  roadmap: Roadmap[];
  stacks: Stack[];
  clientes: Cliente[];
  ocorrencias: Ocorrencia[];
  confluenceReferences: ConfluenceReference[];
}

export interface ApplicationListItem extends Application {
  monitoring: Monitoring | null;
}

export interface ManageApplicationsUseCase {
  getApplicationsList(): Promise<ApplicationListItem[]>;
  getApplicationDetails(id: string): Promise<ApplicationDetails>;

  createApplication(application: Omit<Application, 'id'>): Promise<Application>;
  updateApplication(id: string, application: Partial<Application>): Promise<Application>;
  deleteApplication(id: string): Promise<boolean>;

  saveSubModule(subModule: Omit<SubModule, 'id'> & { id?: string }): Promise<SubModule>;
  deleteSubModule(id: string): Promise<boolean>;

  saveEndpoint(endpoint: Omit<Endpoint, 'id'> & { id?: string }): Promise<Endpoint>;
  deleteEndpoint(id: string): Promise<boolean>;

  getCollaborators(): Promise<Collaborator[]>;
  saveCollaborator(collaborator: Omit<Collaborator, 'id'> & { id?: string }): Promise<Collaborator>;
  associateCollaborator(applicationId: string, collaboratorId: string): Promise<boolean>;
  dissociateCollaborator(applicationId: string, collaboratorId: string): Promise<boolean>;
  deleteCollaborator(id: string): Promise<boolean>;

  saveMonitoring(monitoring: Omit<Monitoring, 'id'> & { id?: string }): Promise<Monitoring>;

  saveRoadmapItem(roadmap: Omit<Roadmap, 'id'> & { id?: string }): Promise<Roadmap>;
  deleteRoadmapItem(id: string): Promise<boolean>;

  getStacks(applicationId: string): Promise<Stack[]>;
  saveStack(stack: Omit<Stack, 'id'> & { id?: string }): Promise<Stack>;
  deleteStack(id: string): Promise<boolean>;

  getClientes(applicationId: string): Promise<Cliente[]>;
  saveCliente(cliente: Omit<Cliente, 'id'> & { id?: string }): Promise<Cliente>;
  deleteCliente(id: string): Promise<boolean>;

  getClienteAtividades(clienteId: string): Promise<ClienteAtividade[]>;
  saveClienteAtividade(atividade: Omit<ClienteAtividade, 'id'> & { id?: string }): Promise<ClienteAtividade>;
  deleteClienteAtividade(id: string): Promise<boolean>;

  getOcorrencias(applicationId: string): Promise<Ocorrencia[]>;
  saveOcorrencia(ocorrencia: Omit<Ocorrencia, 'id'> & { id?: string }): Promise<Ocorrencia>;
  deleteOcorrencia(id: string): Promise<boolean>;

  getConfluenceReferences(applicationId: string): Promise<ConfluenceReference[]>;
  saveConfluenceReference(ref: Omit<ConfluenceReference, 'id'> & { id?: string }): Promise<ConfluenceReference>;
  deleteConfluenceReference(id: string): Promise<boolean>;
}
