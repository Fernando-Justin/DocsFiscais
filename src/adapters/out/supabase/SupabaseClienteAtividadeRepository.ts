import { ClienteAtividadeRepositoryPort } from '@/ports/outgoing/ClienteAtividadeRepositoryPort';
import { ClienteAtividade } from '@/domain/entities/ClienteAtividade';
import { supabase, isSupabaseConfigured, safeSupabaseQuery } from './client';
import { mockDatabase } from './mockDatabase';

export class SupabaseClienteAtividadeRepository implements ClienteAtividadeRepositoryPort {
  async findByClienteId(clienteId: string): Promise<ClienteAtividade[]> {
    if (!isSupabaseConfigured || !supabase) {
      return mockDatabase.getClienteAtividades().filter(a => a.cliente_id === clienteId);
    }

    return safeSupabaseQuery(
      () => supabase!.from('cliente_atividades').select('*').eq('cliente_id', clienteId),
      () => mockDatabase.getClienteAtividades().filter(a => a.cliente_id === clienteId)
    );
  }

  async save(atividade: Omit<ClienteAtividade, 'id'> & { id?: string }): Promise<ClienteAtividade> {
    if (!isSupabaseConfigured || !supabase) {
      return this.saveLocal(atividade);
    }

    try {
      if (atividade.id) {
        const { data, error } = await supabase
          .from('cliente_atividades')
          .update(atividade)
          .eq('id', atividade.id)
          .select()
          .single();

        if (error) return this.saveLocal(atividade);
        return data;
      } else {
        const { data, error } = await supabase
          .from('cliente_atividades')
          .insert(atividade)
          .select()
          .single();

        if (error) return this.saveLocal(atividade);
        return data;
      }
    } catch {
      return this.saveLocal(atividade);
    }
  }

  private saveLocal(atividade: Omit<ClienteAtividade, 'id'> & { id?: string }): ClienteAtividade {
    const list = mockDatabase.getClienteAtividades();
    if (atividade.id) {
      const index = list.findIndex(a => a.id === atividade.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...atividade } as ClienteAtividade;
        mockDatabase.setClienteAtividades(list);
        return list[index];
      }
    }
    const newItem = { ...atividade, id: atividade.id || `atv-${Date.now()}` } as ClienteAtividade;
    list.push(newItem);
    mockDatabase.setClienteAtividades(list);
    return newItem;
  }

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const list = mockDatabase.getClienteAtividades();
      mockDatabase.setClienteAtividades(list.filter(a => a.id !== id));
      return true;
    }

    try {
      const { error } = await supabase.from('cliente_atividades').delete().eq('id', id);
      if (error) {
        const list = mockDatabase.getClienteAtividades();
        mockDatabase.setClienteAtividades(list.filter(a => a.id !== id));
        return true;
      }
      return true;
    } catch {
      const list = mockDatabase.getClienteAtividades();
      mockDatabase.setClienteAtividades(list.filter(a => a.id !== id));
      return true;
    }
  }
}
