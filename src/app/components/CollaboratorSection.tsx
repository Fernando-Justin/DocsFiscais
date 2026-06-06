"use client";

import React, { useState, useEffect } from 'react';
import { Collaborator } from '@/domain/entities/Collaborator';
import { Plus, Link as LinkIcon, Trash2, UserPlus } from 'lucide-react';

interface CollaboratorSectionProps {
  applicationId: string;
  currentCollaborators: Collaborator[];
  allCollaborators: Collaborator[];
  onAssociate: (collaboratorId: string) => Promise<void>;
  onDissociate: (collaboratorId: string) => Promise<void>;
  onCreateAndAssociate: (data: Omit<Collaborator, 'id'>) => Promise<void>;
  onDeleteGlobal: (collaboratorId: string) => Promise<void>;
}

export default function CollaboratorSection({
  applicationId, currentCollaborators, allCollaborators,
  onAssociate, onDissociate, onCreateAndAssociate, onDeleteGlobal
}: CollaboratorSectionProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedExistingId, setSelectedExistingId] = useState('');
  const [nome, setNome] = useState('');
  const [squad, setSquad] = useState('');
  const [papel, setPapel] = useState('dev');
  const [email, setEmail] = useState('');

  const availableToAssociate = allCollaborators.filter(c => !currentCollaborators.some(curr => curr.id === c.id));

  useEffect(() => {
    setSelectedExistingId(availableToAssociate[0]?.id || '');
  }, [allCollaborators, currentCollaborators]);

  const PAPEL_COLORS: Record<string, { bg: string; color: string }> = {
    mantenedor: { bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' },
    dev:        { bg: 'var(--blue-light)',   color: 'var(--blue-primary)' },
    po:         { bg: 'var(--gcp-green-bg)', color: 'var(--gcp-green)' },
    tech_lead:  { bg: 'var(--gcp-red-bg)',   color: 'var(--gcp-red)' },
  };

  const handleAssociate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExistingId) return;
    onAssociate(selectedExistingId);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !squad.trim() || !email.trim()) return;
    await onCreateAndAssociate({ nome, squad, papel, email });
    setNome(''); setSquad(''); setPapel('dev'); setEmail('');
    setShowCreateForm(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

      {/* Tabela de integrantes */}
      <div className="md:col-span-2 rounded-lg border overflow-hidden"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
        <div className="flex items-center justify-between px-3 py-2 border-b"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-hover)" }}>
          <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
            Integrantes da Equipe ({currentCollaborators.length})
          </span>
        </div>

        {currentCollaborators.length === 0 ? (
          <div className="py-8 text-center text-[12px]" style={{ color: "var(--text-muted)" }}>
            Nenhum colaborador associado a esta aplicação.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-medium border-b"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--bg-page)" }}>
                  <th className="px-3 py-2">Nome</th>
                  <th className="px-3 py-2">Squad</th>
                  <th className="px-3 py-2">Papel</th>
                  <th className="px-3 py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentCollaborators.map(c => {
                  const ps = PAPEL_COLORS[c.papel] || PAPEL_COLORS['dev'];
                  return (
                    <tr key={c.id} className="border-b group"
                      style={{ borderColor: "var(--border)" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "")}>
                      <td className="px-3 py-2">
                        <div className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>{c.nome}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{c.email}</div>
                      </td>
                      <td className="px-3 py-2 text-[12px]" style={{ color: "var(--text-secondary)" }}>{c.squad}</td>
                      <td className="px-3 py-2">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded font-mono"
                          style={{ backgroundColor: ps.bg, color: ps.color }}>
                          {c.papel}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => onDissociate(c.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 transition-opacity"
                          title="Remover desta aplicação"
                          style={{ color: "var(--gcp-red)" }}>
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

      {/* Painel lateral de gerenciamento */}
      <div className="space-y-3">

        {/* Associar existente */}
        <div className="rounded-lg border p-3"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
          <div className="flex items-center gap-1.5 mb-2 pb-2 border-b text-[12px] font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>
            <LinkIcon size={12} /> Associar Colaborador
          </div>

          {availableToAssociate.length === 0 ? (
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
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
                <Plus size={11} /> Associar à Aplicação
              </button>
            </form>
          )}
        </div>

        {/* Criar novo colaborador */}
        <div className="rounded-lg border p-3"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
          <div className="flex items-center justify-between mb-2 pb-2 border-b"
            style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-1.5 text-[12px] font-medium"
              style={{ color: "var(--text-primary)" }}>
              <UserPlus size={12} /> Novo Colaborador
            </div>
            <button onClick={() => setShowCreateForm(!showCreateForm)}
              className="text-[10px]" style={{ color: "var(--blue-primary)" }}>
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
                  <select value={papel} onChange={e => setPapel(e.target.value)} className="input-gcp">
                    <option value="dev">dev</option>
                    <option value="mantenedor">mantenedor</option>
                    <option value="po">po</option>
                    <option value="tech_lead">tech lead</option>
                  </select>
                </div>
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
