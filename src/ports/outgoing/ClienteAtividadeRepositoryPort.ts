import { ClienteAtividade } from '@/domain/entities/ClienteAtividade';

export interface ClienteAtividadeRepositoryPort {
  findByClienteId(clienteId: string): Promise<ClienteAtividade[]>;
  save(atividade: Omit<ClienteAtividade, 'id'> & { id?: string }): Promise<ClienteAtividade>;
  delete(id: string): Promise<boolean>;
}
