import { SubModuleRepositoryPort } from '@/ports/outgoing/SubModuleRepositoryPort';
import { SubModule } from '@/domain/entities/SubModule';
import { supabase, isSupabaseConfigured } from './client';
import { mockDatabase } from './mockDatabase';

export class SupabaseSubModuleRepository implements SubModuleRepositoryPort {
  async findByApplicationId(applicationId: string): Promise<SubModule[]> {
    if (!isSupabaseConfigured || !supabase) {
      return mockDatabase.getSubmodules().filter(s => s.application_id === applicationId);
    }

    const { data, error } = await supabase
      .from('submodules')
      .select('*')
      .eq('application_id', applicationId)
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar sub-módulos no Supabase:', error);
      return mockDatabase.getSubmodules().filter(s => s.application_id === applicationId);
    }

    return data || [];
  }

  async save(subModule: Omit<SubModule, 'id'> & { id?: string }): Promise<SubModule> {
    if (!isSupabaseConfigured || !supabase) {
      const list = mockDatabase.getSubmodules();
      if (subModule.id) {
        const index = list.findIndex(s => s.id === subModule.id);
        if (index !== -1) {
          list[index] = { ...list[index], ...subModule } as SubModule;
          mockDatabase.setSubmodules(list);
          return list[index];
        }
      }
      const newSub = { ...subModule, id: subModule.id || `sub-${Date.now()}` } as SubModule;
      list.push(newSub);
      mockDatabase.setSubmodules(list);
      return newSub;
    }

    if (subModule.id) {
      const { data, error } = await supabase
        .from('submodules')
        .update(subModule)
        .eq('id', subModule.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('submodules')
        .insert(subModule)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const list = mockDatabase.getSubmodules();
      const filtered = list.filter(s => s.id !== id);
      mockDatabase.setSubmodules(filtered);
      
      // Limpar submodule_id nos endpoints mockados
      const endpoints = mockDatabase.getEndpoints();
      endpoints.forEach(e => {
        if (e.submodule_id === id) e.submodule_id = null;
      });
      mockDatabase.setEndpoints(endpoints);
      return true;
    }

    const { error } = await supabase
      .from('submodules')
      .delete()
      .eq('id', id);

    return !error;
  }
}
