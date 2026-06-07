import { OcorrenciaRepositoryPort } from '@/ports/outgoing/OcorrenciaRepositoryPort';
import { Ocorrencia } from '@/domain/entities/Ocorrencia';
import { mockDatabase } from './mockDatabase';

export class MockOcorrenciaRepository implements OcorrenciaRepositoryPort {
  async findByApplicationId(applicationId: string): Promise<Ocorrencia[]> {
    return mockDatabase.getOcorrencias().filter(o => o.application_id === applicationId);
  }

  async save(ocorrencia: Omit<Ocorrencia, 'id'> & { id?: string }): Promise<Ocorrencia> {
    const list = mockDatabase.getOcorrencias();
    if (ocorrencia.id) {
      const index = list.findIndex(o => o.id === ocorrencia.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...ocorrencia } as Ocorrencia;
        mockDatabase.setOcorrencias(list);
        return list[index];
      }
    }
    const newItem = { ...ocorrencia, id: ocorrencia.id || `oc-${Date.now()}` } as Ocorrencia;
    list.push(newItem);
    mockDatabase.setOcorrencias(list);
    return newItem;
  }

  async delete(id: string): Promise<boolean> {
    const list = mockDatabase.getOcorrencias();
    mockDatabase.setOcorrencias(list.filter(o => o.id !== id));
    return true;
  }
}
