import { ManageApplicationsService } from '@/domain/usecases/ManageApplicationsService';
import { SupabaseApplicationRepository } from '../out/supabase/SupabaseApplicationRepository';
import { SupabaseSubModuleRepository } from '../out/supabase/SupabaseSubModuleRepository';
import { SupabaseEndpointRepository } from '../out/supabase/SupabaseEndpointRepository';
import { SupabaseCollaboratorRepository } from '../out/supabase/SupabaseCollaboratorRepository';
import { SupabaseMonitoringRepository } from '../out/supabase/SupabaseMonitoringRepository';
import { SupabaseRoadmapRepository } from '../out/supabase/SupabaseRoadmapRepository';
import { SupabaseStackRepository } from '../out/supabase/SupabaseStackRepository';
import { SupabaseClienteRepository } from '../out/supabase/SupabaseClienteRepository';
import { SupabaseClienteAtividadeRepository } from '../out/supabase/SupabaseClienteAtividadeRepository';

const appRepo = new SupabaseApplicationRepository();
const submoduleRepo = new SupabaseSubModuleRepository();
const endpointRepo = new SupabaseEndpointRepository();
const collaboratorRepo = new SupabaseCollaboratorRepository();
const monitoringRepo = new SupabaseMonitoringRepository();
const roadmapRepo = new SupabaseRoadmapRepository();
const stackRepo = new SupabaseStackRepository();
const clienteRepo = new SupabaseClienteRepository();
const clienteAtividadeRepo = new SupabaseClienteAtividadeRepository();

export const almService = new ManageApplicationsService(
  appRepo,
  submoduleRepo,
  endpointRepo,
  collaboratorRepo,
  monitoringRepo,
  roadmapRepo,
  stackRepo,
  clienteRepo,
  clienteAtividadeRepo
);
export type { ApplicationDetails, ApplicationListItem } from '@/ports/incoming/ManageApplicationsUseCase';
export type { Trimestre, RoadmapStatus } from '@/domain/entities/Roadmap';
export type { StackCategoria, StackStatus } from '@/domain/entities/Stack';
export type { ClienteStatus } from '@/domain/entities/Cliente';
export type { AtividadeStatus } from '@/domain/entities/ClienteAtividade';
