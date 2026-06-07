"use client";

import React, { useState, useEffect } from 'react';
import { Collaborator, ColaboradorPapel, ColaboradorStatus } from '@/domain/entities/Collaborator';
import { Plus, Link as LinkIcon, Trash2, UserPlus } from 'lucide-react';
import { getStatusStyle } from './statusStyles';

interface CollaboratorSectionProps {
  applicationId: string;
  currentCollaborators: Collaborator[];
  allCollaborators: Collaborator[];
  onAssociate: (collaboratorId: string) => Promise<void>;
  onDissociate: (collaboratorId: string) => Promise<void>;
  onCreateAndAssociate: (data: Omit<Collaborator, 'id'>) => Promise<void>;
  onDeleteGlobal: (collaboratorId: string) => Promise<void>;
}

const PAPEL_OPTIONS: ColaboradorPapel[] = [
  'Desenvolvedor', 'Tech Lead', 'Arquiteto', 'DevOps', 'QA', 'Suporte NOC', 'PO', 'Outro'
];

const PAPEL_STYLES: Record<string, { bg: string; color: string }> = {
  'Desenvolvedor': { bg: 'var(--blue-light)', color: 'var(--blue-primary)' },
  'Tech Lead': { bg: 'var(--gcp-red-bg)', color: 'var(--gcp-red)' },
  'Arquiteto': { bg: 'var(--gcp-purple)', color: '#FFF' },
  'DevOps': { bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' },
  'QA': { bg: 'var(--gcp-green-bg)', color: 'var(--gcp-green)' },
  'Suporte NOC': { bg: 'var(--bg-hover)', color: 'var(--text-secondary)' },
  'PO': { bg: '#F3E5FF', color: 'var(--gcp-purple)' },
  'Outro': { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
};

export default function CollaboratorSection({
  applicationId, currentCollaborators, allCollaborators,
  onAssociate, onDissociate, onCreateAndAssociate, onDeleteGlobal
}: CollaboratorSectionProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedExistingId, setSelectedExistingId] = useState('');
  const [nome, setNome] = useState('');
  const [squad, setSquad] = useState('');
  const [papel, setPapel] = useState<ColaboradorPapel>('Desenvolvedor');
  const [email, setEmail] = useState('');
  const [contato, setContato] = useState('');
  const [status, setStatus] = useState<ColaboradorStatus>('Ativo');
  const [nivelAcesso, setNivelAcesso] = useState('');

  const availableToAssociate = allCollaborators.filter(c => !currentCollaborators.some(curr => curr.id === c.id));

  useEffect(() => {
    setSelectedExistingId(availableToAssociate[0]?.id || '');
  }, [allCollaborators, currentCollaborators]);

  const handleAssociate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExistingId) return;
    onAssociate(selectedExistingId);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !squad.trim() || !email.trim()) return;
    await onCreateAndAssociate({
      nome: nome.trim(), squad: squad.trim(), papel, email: email.trim(),
      contato: contato.trim() || null, status, nivel_acesso: nivelAcesso.trim() || null,
    });
    setNome(''); setSquad(''); setPapel('Desenvolvedor'); setEmail('');
    setContato(''); setStatus('Ativo'); setNivelAcesso('');
    setShowCreateForm(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Tabela de integrantes */}
      <div className="md:col-span-2 rounded-lg border overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center justify-between px-3 py-2 border-b"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-hover)' }}>
          <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
            Integrantes da Equipe ({currentCollaborators.length})
          </span>
        </div>

        {currentCollaborators.length === 0 ? (
          <div className="py-8 text-center text-[12px]" style={{ color: 'var(--text-muted)' }}>
            Nenhum colaborador associado a esta aplicação.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-medium border-b"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-page)' }}>
                  <th className="px-3 py-2">Nome</th>
                  <th className="px-3 py-2">Squad</th>
                  <th className="px-3 py-2">Papel</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentCollaborators.map(c => {
                  const ps = PAPEL_STYLES[c.papel] || PAPEL_STYLES['Outro'];
                  const ss = getStatusStyle(c.status);
                  return (
                    <tr key={c.id} className="border-b group"
                      style={{ borderColor: 'var(--border)' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                      <td className="px-3 py-2">
                        <div className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>{c.nome}</div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{c.email}</div>
                      </td>
                      <td className="px-3 py-2 text-[12px]" style={{ color: 'var(--text-secondary)' }}>{c.squad}</td>
                      <td className="px-3 py-2">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: ps.bg, color: ps.color }}>
                          {c.papel}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: ss.bg, color: ss.color }}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => onDissociate(c.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 transition-opacity"
                          title="Remover desta aplicação"
                          style={{ color: 'var(--gcp-red)' }}>
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Painel lateral */}
      <div className="space-y-3">
        {/* Associar existente */}
        <div className="rounded-lg border p-3"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center gap-1.5 mb-2 pb-2 border-b text-[12px] font-medium"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            <LinkIcon size={12} /> Associar Colaborador
          </div>
          {availableToAssociate.length === 0 ? (
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Todos os colaboradores já fazem parte deste time.
            </p>
          ) : (
            <form onSubmit={handleAssociate} className="space-y-2">
              <div>
                <label className="label-compact">Colaborador Disponível</label>
                <select value={selectedExistingId} onChange={e => setSelectedExistingId(e.target.value)}
                  className="input-gcp">
                  {availableToAssociate.map(c => (
                    <option key={c.id} value={c.id}>{c.nome} ({c.squad})</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-secondary w-full flex items-center justify-center gap-1.5 text-[11px]">
                <Plus size={11} /> Associar
              </button>
            </form>
          )}
        </div>

        {/* Criar novo */}
        <div className="rounded-lg border p-3"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center justify-between mb-2 pb-2 border-b"
            style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
              <UserPlus size={12} /> Novo Colaborador
            </div>
            <button onClick={() => setShowCreateForm(!showCreateForm)}
              className="text-[10px]" style={{ color: 'var(--blue-primary)' }}>
              {showCreateForm ? 'Ocultar' : 'Expandir'}
            </button>
          </div>
          {showCreateForm && (
            <form onSubmit={handleCreate} className="space-y-1.5">
              <div>
                <label className="label-compact">Nome *</label>
                <input type="text" required value={nome} onChange={e => setNome(e.target.value)}
                  placeholder="Ana Souza" className="input-gcp" />
              </div>
              <div>
                <label className="label-compact">Email *</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="ana@company.com" className="input-gcp" />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="label-compact">Squad *</label>
                  <input type="text" required value={squad} onChange={e => setSquad(e.target.value)}
                    placeholder="Squad Growth" className="input-gcp" />
                </div>
                <div>
                  <label className="label-compact">Papel</label>
                  <select value={papel} onChange={e => setPapel(e.target.value as ColaboradorPapel)} className="input-gcp">
                    {PAPEL_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="label-compact">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as ColaboradorStatus)} className="input-gcp">
                    <option value="Ativo">Ativo</option>
                    <option value="Temporário">Temporário</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
                <div>
                  <label className="label-compact">Contato</label>
                  <input type="text" value={contato} onChange={e => setContato(e.target.value)}
                    placeholder="@slack ou telefone" className="input-gcp" />
                </div>
              </div>
              <div>
                <label className="label-compact">Nível de Acesso</label>
                <input type="text" value={nivelAcesso} onChange={e => setNivelAcesso(e.target.value)}
                  placeholder="Ex: Total, Leitura, Administrativo" className="input-gcp" />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-1.5 text-[11px]" style={{ marginTop: 8 }}>
                <Plus size={11} /> Salvar & Associar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
