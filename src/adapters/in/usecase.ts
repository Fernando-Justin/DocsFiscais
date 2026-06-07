import { ManageApplicationsService } from '@/domain/usecases/ManageApplicationsService';
import { SupabaseApplicationRepository } from '@/adapters/out/supabase/SupabaseApplicationRepository';
import { SupabaseSubModuleRepository } from '@/adapters/out/supabase/SupabaseSubModuleRepository';
import { SupabaseEndpointRepository } from '@/adapters/out/supabase/SupabaseEndpointRepository';
import { SupabaseCollaboratorRepository } from '@/adapters/out/supabase/SupabaseCollaboratorRepository';
import { SupabaseMonitoringRepository } from '@/adapters/out/supabase/SupabaseMonitoringRepository';
import { SupabaseRoadmapRepository } from '@/adapters/out/supabase/SupabaseRoadmapRepository';
import { SupabaseStackRepository } from '@/adapters/out/supabase/SupabaseStackRepository';
import { SupabaseClienteRepository } from '@/adapters/out/supabase/SupabaseClienteRepository';
import { SupabaseClienteAtividadeRepository } from '@/adapters/out/supabase/SupabaseClienteAtividadeRepository';
import { MockOcorrenciaRepository } from '@/adapters/out/supabase/MockOcorrenciaRepository';
import { MockConfluenceReferenceRepository } from '@/adapters/out/supabase/MockConfluenceReferenceRepository';

const appRepo = new SupabaseApplicationRepository();
const submoduleRepo = new SupabaseSubModuleRepository();
const endpointRepo = new SupabaseEndpointRepository();
const collaboratorRepo = new SupabaseCollaboratorRepository();
const monitoringRepo = new SupabaseMonitoringRepository();
const roadmapRepo = new SupabaseRoadmapRepository();
const stackRepo = new SupabaseStackRepository();
const clienteRepo = new SupabaseClienteRepository();
const clienteAtividadeRepo = new SupabaseClienteAtividadeRepository();
const ocorrenciaRepo = new MockOcorrenciaRepository();
const confluenceRepo = new MockConfluenceReferenceRepository();

export const almService = new ManageApplicationsService(
  appRepo, submoduleRepo, endpointRepo, collaboratorRepo,
  monitoringRepo, roadmapRepo, stackRepo, clienteRepo,
  clienteAtividadeRepo, ocorrenciaRepo, confluenceRepo
);

export type { ApplicationDetails, ApplicationListItem } from '@/ports/incoming/ManageApplicationsUseCase';
export type { Trimestre, RoadmapStatus, RoadmapCategoria, RoadmapPrioridade } from '@/domain/entities/Roadmap';
export type { StackCategoria, StackStatus } from '@/domain/entities/Stack';
export type { ClienteStatus, ClienteEndpoint } from '@/domain/entities/Cliente';
export type { AtividadeStatus } from '@/domain/entities/ClienteAtividade';
export type { ColaboradorPapel, ColaboradorStatus } from '@/domain/entities/Collaborator';
export type { OcorrenciaTipo, OcorrenciaAmbiente, OcorrenciaOfensor, OcorrenciaStatus } from '@/domain/entities/Ocorrencia';
export type { ConfluenceCategoria } from '@/domain/entities/ConfluenceReference';
