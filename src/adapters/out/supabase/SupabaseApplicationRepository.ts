import { ApplicationRepositoryPort } from '@/ports/outgoing/ApplicationRepositoryPort';
import { Application } from '@/domain/entities/Application';
import { supabase, isSupabaseConfigured } from './client';
import { mockDatabase } from './mockDatabase';

export class SupabaseApplicationRepository implements ApplicationRepositoryPort {
  async findAll(): Promise<Application[]> {
    if (!isSupabaseConfigured || !supabase) {
      return mockDatabase.getApplications();
    }

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar aplicações no Supabase:', error);
      return mockDatabase.getApplications(); // Fallback para não quebrar a tela
    }

    return data || [];
  }

  async findById(id: string): Promise<Application | null> {
    if (!isSupabaseConfigured || !supabase) {
      const apps = mockDatabase.getApplications();
      return apps.find(a => a.id === id) || null;
    }

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erro ao buscar aplicação ${id} no Supabase:`, error);
      const apps = mockDatabase.getApplications();
      return apps.find(a => a.id === id) || null;
    }

    return data;
  }

  async save(application: Omit<Application, 'id'> & { id?: string }): Promise<Application> {
    if (!isSupabaseConfigured || !supabase) {
      const apps = mockDatabase.getApplications();
      if (application.id) {
        const index = apps.findIndex(a => a.id === application.id);
        if (index !== -1) {
          apps[index] = { ...apps[index], ...application } as Application;
          mockDatabase.setApplications(apps);
          return apps[index];
        }
      }
      const newApp = { ...application, id: application.id || `app-${Date.now()}` } as Application;
      apps.push(newApp);
      mockDatabase.setApplications(apps);
      return newApp;
    }

    if (application.id) {
      const { data, error } = await supabase
        .from('applications')
        .update(application)
        .eq('id', application.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('applications')
        .insert(application)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const apps = mockDatabase.getApplications();
      const filtered = apps.filter(a => a.id !== id);
      mockDatabase.setApplications(filtered);
      
      // Limpar dependências mockadas
      mockDatabase.setSubmodules(mockDatabase.getSubmodules().filter(s => s.application_id !== id));
      mockDatabase.setEndpoints(mockDatabase.getEndpoints().filter(e => e.application_id !== id));
      mockDatabase.setRoadmap(mockDatabase.getRoadmap().filter(r => r.application_id !== id));
      mockDatabase.setMonitoring(mockDatabase.getMonitoring().filter(m => m.application_id !== id));
      mockDatabase.setRelations(mockDatabase.getRelations().filter(r => r.application_id !== id));
      return true;
    }

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    return !error;
  }
}
