import { ClienteRepositoryPort } from '@/ports/outgoing/ClienteRepositoryPort';
import { Cliente } from '@/domain/entities/Cliente';
import { supabase, isSupabaseConfigured, safeSupabaseQuery } from './client';
import { mockDatabase } from './mockDatabase';

export class SupabaseClienteRepository implements ClienteRepositoryPort {
  async findByApplicationId(applicationId: string): Promise<Cliente[]> {
    if (!isSupabaseConfigured || !supabase) {
      return mockDatabase.getClientes().filter(c => c.application_id === applicationId);
    }

    return safeSupabaseQuery(
      () => supabase!.from('clientes').select('*').eq('application_id', applicationId),
      () => mockDatabase.getClientes().filter(c => c.application_id === applicationId)
    );
  }

  async save(cliente: Omit<Cliente, 'id'> & { id?: string }): Promise<Cliente> {
    if (!isSupabaseConfigured || !supabase) {
      return this.saveLocal(cliente);
    }

    try {
      if (cliente.id) {
        const { data, error } = await supabase
          .from('clientes')
          .update(cliente)
          .eq('id', cliente.id)
          .select()
          .single();

        if (error) return this.saveLocal(cliente);
        return data;
      } else {
        const { data, error } = await supabase
          .from('clientes')
          .insert(cliente)
          .select()
          .single();

        if (error) return this.saveLocal(cliente);
        return data;
      }
    } catch {
      return this.saveLocal(cliente);
    }
  }

  private saveLocal(cliente: Omit<Cliente, 'id'> & { id?: string }): Cliente {
    const list = mockDatabase.getClientes();
    if (cliente.id) {
      const index = list.findIndex(c => c.id === cliente.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...cliente } as Cliente;
        mockDatabase.setClientes(list);
        return list[index];
      }
    }
    const newItem = { ...cliente, id: cliente.id || `cli-${Date.now()}` } as Cliente;
    list.push(newItem);
    mockDatabase.setClientes(list);
    return newItem;
  }

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const list = mockDatabase.getClientes();
      mockDatabase.setClientes(list.filter(c => c.id !== id));
      return true;
    }

    try {
      const { error } = await supabase.from('clientes').delete().eq('id', id);
      if (error) {
        const list = mockDatabase.getClientes();
        mockDatabase.setClientes(list.filter(c => c.id !== id));
        return true;
      }
      return true;
    } catch {
      const list = mockDatabase.getClientes();
      mockDatabase.setClientes(list.filter(c => c.id !== id));
      return true;
    }
  }
}
