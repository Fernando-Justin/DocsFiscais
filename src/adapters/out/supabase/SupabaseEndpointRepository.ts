import { EndpointRepositoryPort } from '@/ports/outgoing/EndpointRepositoryPort';
import { Endpoint } from '@/domain/entities/Endpoint';
import { supabase, isSupabaseConfigured } from './client';
import { mockDatabase } from './mockDatabase';

export class SupabaseEndpointRepository implements EndpointRepositoryPort {
  async findByApplicationId(applicationId: string): Promise<Endpoint[]> {
    if (!isSupabaseConfigured || !supabase) {
      return mockDatabase.getEndpoints().filter(e => e.application_id === applicationId);
    }

    const { data, error } = await supabase
      .from('endpoints')
      .select('*')
      .eq('application_id', applicationId)
      .order('path', { ascending: true });

    if (error) {
      console.error('Erro ao buscar endpoints no Supabase:', error);
      return mockDatabase.getEndpoints().filter(e => e.application_id === applicationId);
    }

    return data || [];
  }

  async save(endpoint: Omit<Endpoint, 'id'> & { id?: string }): Promise<Endpoint> {
    if (!isSupabaseConfigured || !supabase) {
      const list = mockDatabase.getEndpoints();
      if (endpoint.id) {
        const index = list.findIndex(e => e.id === endpoint.id);
        if (index !== -1) {
          list[index] = { ...list[index], ...endpoint } as Endpoint;
          mockDatabase.setEndpoints(list);
          return list[index];
        }
      }
      const newEnd = { ...endpoint, id: endpoint.id || `end-${Date.now()}` } as Endpoint;
      list.push(newEnd);
      mockDatabase.setEndpoints(list);
      return newEnd;
    }

    if (endpoint.id) {
      const { data, error } = await supabase
        .from('endpoints')
        .update(endpoint)
        .eq('id', endpoint.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('endpoints')
        .insert(endpoint)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const list = mockDatabase.getEndpoints();
      const filtered = list.filter(e => e.id !== id);
      mockDatabase.setEndpoints(filtered);
      return true;
    }

    const { error } = await supabase
      .from('endpoints')
      .delete()
      .eq('id', id);

    return !error;
  }
}
