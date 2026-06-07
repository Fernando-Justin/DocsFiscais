import { ConfluenceReferenceRepositoryPort } from '@/ports/outgoing/ConfluenceReferenceRepositoryPort';
import { ConfluenceReference } from '@/domain/entities/ConfluenceReference';
import { mockDatabase } from './mockDatabase';

export class MockConfluenceReferenceRepository implements ConfluenceReferenceRepositoryPort {
  async findByApplicationId(applicationId: string): Promise<ConfluenceReference[]> {
    return mockDatabase.getConfluenceReferences().filter(r => r.application_id === applicationId);
  }

  async save(ref: Omit<ConfluenceReference, 'id'> & { id?: string }): Promise<ConfluenceReference> {
    const list = mockDatabase.getConfluenceReferences();
    if (ref.id) {
      const index = list.findIndex(r => r.id === ref.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...ref } as ConfluenceReference;
        mockDatabase.setConfluenceReferences(list);
        return list[index];
      }
    }
    const newItem = { ...ref, id: ref.id || `cr-${Date.now()}` } as ConfluenceReference;
    list.push(newItem);
    mockDatabase.setConfluenceReferences(list);
    return newItem;
  }

  async delete(id: string): Promise<boolean> {
    const list = mockDatabase.getConfluenceReferences();
    mockDatabase.setConfluenceReferences(list.filter(r => r.id !== id));
    return true;
  }
}
