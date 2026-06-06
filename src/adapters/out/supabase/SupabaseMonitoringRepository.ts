import { MonitoringRepositoryPort } from '@/ports/outgoing/MonitoringRepositoryPort';
import { Monitoring } from '@/domain/entities/Monitoring';
import { supabase, isSupabaseConfigured } from './client';
import { mockDatabase } from './mockDatabase';

export class SupabaseMonitoringRepository implements MonitoringRepositoryPort {
  async findByApplicationId(applicationId: string): Promise<Monitoring | null> {
    if (!isSupabaseConfigured || !supabase) {
      const list = mockDatabase.getMonitoring();
      return list.find(m => m.application_id === applicationId) || null;
    }

    const { data, error } = await supabase
      .from('monitoring')
      .select('*')
      .eq('application_id', applicationId)
      .maybeSingle();

    if (error) {
      console.error(`Erro ao buscar monitoria da aplicação ${applicationId}:`, error);
      const list = mockDatabase.getMonitoring();
      return list.find(m => m.application_id === applicationId) || null;
    }

    return data;
  }

  async save(monitoring: Omit<Monitoring, 'id'> & { id?: string }): Promise<Monitoring> {
    if (!isSupabaseConfigured || !supabase) {
      const list = mockDatabase.getMonitoring();
      
      // Como é relação 1:1 conceitualmente, se já houver um registro para a aplicação, atualizamos
      const index = list.findIndex(m => m.application_id === monitoring.application_id);
      if (index !== -1) {
        list[index] = { ...list[index], ...monitoring } as Monitoring;
        mockDatabase.setMonitoring(list);
        return list[index];
      }
      
      const newMon = { ...monitoring, id: monitoring.id || `mon-${Date.now()}` } as Monitoring;
      list.push(newMon);
      mockDatabase.setMonitoring(list);
      return newMon;
    }

    // Tentar obter o id existente no supabase se não fornecido
    let existingId = monitoring.id;
    if (!existingId) {
      const { data } = await supabase
        .from('monitoring')
        .select('id')
        .eq('application_id', monitoring.application_id)
        .maybeSingle();
      if (data) existingId = data.id;
    }

    if (existingId) {
      const { data, error } = await supabase
        .from('monitoring')
        .update(monitoring)
        .eq('id', existingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('monitoring')
        .insert(monitoring)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  async deleteByApplicationId(applicationId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const list = mockDatabase.getMonitoring();
      const filtered = list.filter(m => m.application_id !== applicationId);
      mockDatabase.setMonitoring(filtered);
      return true;
    }

    const { error } = await supabase
      .from('monitoring')
      .delete()
      .eq('application_id', applicationId);

    return !error;
  }
}
