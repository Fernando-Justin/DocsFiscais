import { ManageApplicationsService } from '@/domain/usecases/ManageApplicationsService';
import { SupabaseApplicationRepository } from '../out/supabase/SupabaseApplicationRepository';
import { SupabaseSubModuleRepository } from '../out/supabase/SupabaseSubModuleRepository';
import { SupabaseEndpointRepository } from '../out/supabase/SupabaseEndpointRepository';
import { SupabaseCollaboratorRepository } from '../out/supabase/SupabaseCollaboratorRepository';
import { SupabaseMonitoringRepository } from '../out/supabase/SupabaseMonitoringRepository';
import { SupabaseRoadmapRepository } from '../out/supabase/SupabaseRoadmapRepository';

const appRepo = new SupabaseApplicationRepository();
const submoduleRepo = new SupabaseSubModuleRepository();
const endpointRepo = new SupabaseEndpointRepository();
const collaboratorRepo = new SupabaseCollaboratorRepository();
const monitoringRepo = new SupabaseMonitoringRepository();
const roadmapRepo = new SupabaseRoadmapRepository();

export const almService = new ManageApplicationsService(
  appRepo,
  submoduleRepo,
  endpointRepo,
  collaboratorRepo,
  monitoringRepo,
  roadmapRepo
);
export type { ApplicationDetails, ApplicationListItem } from '@/ports/incoming/ManageApplicationsUseCase';
export type { Trimestre, RoadmapStatus } from '@/domain/entities/Roadmap';
