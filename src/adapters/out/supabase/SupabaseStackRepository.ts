import { StackRepositoryPort } from '@/ports/outgoing/StackRepositoryPort';
import { Stack } from '@/domain/entities/Stack';
import { supabase, isSupabaseConfigured, safeSupabaseQuery } from './client';
import { mockDatabase } from './mockDatabase';

export class SupabaseStackRepository implements StackRepositoryPort {
  async findByApplicationId(applicationId: string): Promise<Stack[]> {
    if (!isSupabaseConfigured || !supabase) {
      return mockDatabase.getStacks().filter(s => s.application_id === applicationId);
    }

    return safeSupabaseQuery(
      () => supabase!.from('stacks').select('*').eq('application_id', applicationId),
      () => mockDatabase.getStacks().filter(s => s.application_id === applicationId)
    );
  }

  async save(stack: Omit<Stack, 'id'> & { id?: string }): Promise<Stack> {
    if (!isSupabaseConfigured || !supabase) {
      return this.saveLocal(stack);
    }

    try {
      if (stack.id) {
        const { data, error } = await supabase
          .from('stacks')
          .update(stack)
          .eq('id', stack.id)
          .select()
          .single();

        if (error) return this.saveLocal(stack);
        return data;
      } else {
        const { data, error } = await supabase
          .from('stacks')
          .insert(stack)
          .select()
          .single();

        if (error) return this.saveLocal(stack);
        return data;
      }
    } catch {
      return this.saveLocal(stack);
    }
  }

  private saveLocal(stack: Omit<Stack, 'id'> & { id?: string }): Stack {
    const list = mockDatabase.getStacks();
    if (stack.id) {
      const index = list.findIndex(s => s.id === stack.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...stack } as Stack;
        mockDatabase.setStacks(list);
        return list[index];
      }
    }
    const newItem = { ...stack, id: stack.id || `stack-${Date.now()}` } as Stack;
    list.push(newItem);
    mockDatabase.setStacks(list);
    return newItem;
  }

  async delete(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const list = mockDatabase.getStacks();
      mockDatabase.setStacks(list.filter(s => s.id !== id));
      return true;
    }

    try {
      const { error } = await supabase.from('stacks').delete().eq('id', id);
      if (error) {
        const list = mockDatabase.getStacks();
        mockDatabase.setStacks(list.filter(s => s.id !== id));
        return true;
      }
      return true;
    } catch {
      const list = mockDatabase.getStacks();
      mockDatabase.setStacks(list.filter(s => s.id !== id));
      return true;
    }
  }
}
