import { CollaboratorRepositoryPort } from '@/ports/outgoing/CollaboratorRepositoryPort';
import { Collaborator } from '@/domain/entities/Collaborator';
import { supabase, isSupabaseConfigured } from './client';
import { mockDatabase } from './mockDatabase';

export class SupabaseCollaboratorRepository implements CollaboratorRepositoryPort {
  async findAll(): Promise<Collaborator[]> {
    if (!isSupabaseConfigured || !supabase) {
      const colls = mockDatabase.getCollaborators();
      const rels = mockDatabase.getRelations();
      return colls.map(c => ({
        ...c,
        application_ids: rels.filter(r => r.collaborator_id === c.id).map(r => r.application_id)
      }));
    }

    const { data: collaborators, error } = await supabase
      .from('collaborators')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar todos os colaboradores:', error);
      return [];
    }

    // Buscar relações
    const { data: relations, error: relError } = await supabase
      .from('application_collaborators')
      .select('*');

    if (relError) {
      console.error('Erro ao buscar relações de colaboradores:', relError);
      return (collaborators || []).map(c => ({ ...c, application_ids: [] }));
    }

    return (collaborators || []).map(c => {
      const appIds = relations
        ? relations.filter(r => r.collaborator_id === c.id).map(r => r.application_id)
        : [];
      return {
        ...c,
        application_ids: appIds
      };
    });
  }

  async findByApplicationId(applicationId: string): Promise<Collaborator[]> {
    if (!isSupabaseConfigured || !supabase) {
      const rels = mockDatabase.getRelations().filter(r => r.application_id === applicationId);
      const colls = mockDatabase.getCollaborators();
      return colls
        .filter(c => rels.some(r => r.collaborator_id === c.id))
        .map(c => ({
          ...c,
          application_ids: [applicationId]
        }));
    }

    const { data, error } = await supabase
      .from('application_collaborators')
      .select('collaborators(*)')
      .eq('application_id', applicationId);

    if (error) {
      console.error(`Erro ao buscar colaboradores da aplicação ${applicationId}:`, error);
      return [];
    }

    // Extrair os colaboradores do retorno
    return (data || [])
      .map((item: any) => item.collaborators)
      .filter(Boolean)
      .map((c: any) => ({
        ...c,
        application_ids: [applicationId]
      }));
  }

  async save(collaborator: Omit<Collaborator, 'id' | 'application_ids'> & { id?: string }): Promise<Collaborator> {
    if (!isSupabaseConfigured || !supabase) {
      const list = mockDatabase.getCollaborators();
      if (collaborator.id) {
        const index = list.findIndex(c => c.id === collaborator.id);
        if (index !== -1) {
          list[index] = { ...list[index], ...collaborator } as Collaborator;
          mockDatabase.setCollaborators(list);
          return list[index];
        }
      }
      const newColl = { ...collaborator, id: collaborator.id || `col-${Date.now()}` } as Collaborator;
      list.push(newColl);
      mockDatabase.setCollaborators(list);
      return newColl;
    }

    if (collaborator.id) {
      const { data, error } = await supabase
        .from('collaborators')
        .update(collaborator)
        .eq('id', collaborator.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('collaborators')
        .insert(collaborator)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  async associateToApplication(applicationId: string, collaboratorId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const rels = mockDatabase.getRelations();
      const exists = rels.some(r => r.application_id === applicationId && r.collaborator_id === collaboratorId);
      if (!exists) {
        rels.push({ application_id: applicationId, collaborator_id: collaboratorId });
        mockDatabase.setRelations(rels);
      }
      return true;
    }

    const { error } = await supabase
      .from('application_collaborators')
      .insert({ application_id: applicationId, collaborator_id: collaboratorId });

    if (error && error.code !== '23505') { // Ignorar erro de duplicidade (PK conflict)
      console.error('Erro ao associar colaborador à aplicação:', error);
      return false;
    }

    return true;
  }

  async dissociateFromApplication(applicationId: string, collaboratorId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const rels = mockDatabase.getRelations();
      const filtered = rels.filter(r => !(r.application_id === applicationId && r.collaborator_id === collaboratorId));
      mockDatabase.setRelations(filtered);
      return true;
    }

    const { error } = await supabase
      .from('application_collaborators')
      .delete()
      .eq('application_id', applicationId)
      .eq('collaborator_id', collaboratorId);

    return !error;
  }

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const colls = mockDatabase.getCollaborators();
      const filteredColls = colls.filter(c => c.id !== id);
      mockDatabase.setCollaborators(filteredColls);

      const rels = mockDatabase.getRelations();
      const filteredRels = rels.filter(r => r.collaborator_id !== id);
      mockDatabase.setRelations(filteredRels);
      return true;
    }

    const { error } = await supabase
      .from('collaborators')
      .delete()
      .eq('id', id);

    return !error;
  }
}
