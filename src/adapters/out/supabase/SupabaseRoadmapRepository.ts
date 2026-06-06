import { RoadmapRepositoryPort } from '@/ports/outgoing/RoadmapRepositoryPort';
import { Roadmap } from '@/domain/entities/Roadmap';
import { supabase, isSupabaseConfigured } from './client';
import { mockDatabase } from './mockDatabase';

export class SupabaseRoadmapRepository implements RoadmapRepositoryPort {
  async findByApplicationId(applicationId: string): Promise<Roadmap[]> {
    if (!isSupabaseConfigured || !supabase) {
      return mockDatabase.getRoadmap()
        .filter(r => r.application_id === applicationId)
        .orderRoadmap();
    }

    const { data, error } = await supabase
      .from('roadmap')
      .select('*')
      .eq('application_id', applicationId)
      .order('ano', { ascending: true })
      .order('trimestre', { ascending: true });

    if (error) {
      console.error('Erro ao buscar roadmap no Supabase:', error);
      return mockDatabase.getRoadmap()
        .filter(r => r.application_id === applicationId)
        .orderRoadmap();
    }

    return data || [];
  }

  async save(roadmap: Omit<Roadmap, 'id'> & { id?: string }): Promise<Roadmap> {
    if (!isSupabaseConfigured || !supabase) {
      const list = mockDatabase.getRoadmap();
      if (roadmap.id) {
        const index = list.findIndex(r => r.id === roadmap.id);
        if (index !== -1) {
          list[index] = { ...list[index], ...roadmap } as Roadmap;
          mockDatabase.setRoadmap(list);
          return list[index];
        }
      }
      const newRoad = { ...roadmap, id: roadmap.id || `road-${Date.now()}` } as Roadmap;
      list.push(newRoad);
      mockDatabase.setRoadmap(list);
      return newRoad;
    }

    if (roadmap.id) {
      const { data, error } = await supabase
        .from('roadmap')
        .update(roadmap)
        .eq('id', roadmap.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('roadmap')
        .insert(roadmap)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const list = mockDatabase.getRoadmap();
      const filtered = list.filter(r => r.id !== id);
      mockDatabase.setRoadmap(filtered);
      return true;
    }

    const { error } = await supabase
      .from('roadmap')
      .delete()
      .eq('id', id);

    return !error;
  }
}

// Extensão rápida de helper para ordenar o roadmap mockado por trimestre
declare global {
  interface Array<T> {
    orderRoadmap(): T[];
  }
}

if (!Array.prototype.orderRoadmap) {
  Array.prototype.orderRoadmap = function() {
    return this.sort((a, b) => {
      if (a.ano !== b.ano) return a.ano - b.ano;
      const tMap = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };
      return (tMap[a.trimestre as keyof typeof tMap] || 0) - (tMap[b.trimestre as keyof typeof tMap] || 0);
    });
  };
}
export {};
