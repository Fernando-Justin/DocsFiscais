"use client";

import React, { useState, useEffect } from 'react';
import { Stack, StackCategoria, StackStatus } from '@/domain/entities/Stack';
import { Plus, Trash2 } from 'lucide-react';

interface StackFormProps {
  applicationId: string;
  stacks: Stack[];
  onSave: (data: Omit<Stack, 'id'> & { id?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const CATEGORIA_LABELS: Record<StackCategoria, string> = {
  linguagem: 'Linguagem',
  framework: 'Framework',
  banco_dados: 'Banco de Dados',
};

const STATUS_STYLES: Record<StackStatus, { bg: string; color: string }> = {
  'Em Uso': { bg: 'var(--gcp-green-bg)', color: 'var(--gcp-green)' },
  'Em Migração': { bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' },
  'Descontinuado': { bg: 'var(--gcp-red-bg)', color: 'var(--gcp-red)' },
  'Em Avaliação': { bg: 'var(--blue-light)', color: 'var(--blue-primary)' },
};

const CATEGORIA_STYLES: Record<StackCategoria, { bg: string; color: string }> = {
  linguagem: { bg: 'var(--blue-light)', color: 'var(--blue-primary)' },
  framework: { bg: 'var(--gcp-green-bg)', color: 'var(--gcp-green)' },
  banco_dados: { bg: 'var(--bg-hover)', color: 'var(--text-secondary)' },
};

export default function StackForm({ applicationId, stacks, onSave, onDelete }: StackFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [versao, setVersao] = useState('');
  const [categoria, setCategoria] = useState<StackCategoria>('linguagem');
  const [status, setStatus] = useState<StackStatus>('Em Uso');
  const [observacao, setObservacao] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    await onSave({ application_id: applicationId, nome: nome.trim(), versao: versao.trim(), categoria, status, observacao: observacao.trim() || null });
    setNome(''); setVersao(''); setCategoria('linguagem'); setStatus('Em Uso'); setObservacao('');
    setShowForm(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
          Stack Tecnológica ({stacks.length})
        </span>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "var(--blue-primary)" }}>
          <Plus size={11} /> {showForm ? 'Fechar' : 'Adicionar Tecnologia'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border p-3 space-y-2"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label-compact">Nome *</label>
              <input type="text" required value={nome} onChange={e => setNome(e.target.value)}
                placeholder="Ex: React" className="input-gcp" />
            </div>
            <div>
              <label className="label-compact">Versão</label>
              <input type="text" value={versao} onChange={e => setVersao(e.target.value)}
                placeholder="Ex: 19.2" className="input-gcp" />
            </div>
            <div>
              <label className="label-compact">Categoria</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value as StackCategoria)} className="input-gcp">
                <option value="linguagem">Linguagem</option>
                <option value="framework">Framework</option>
                <option value="banco_dados">Banco de Dados</option>
              </select>
            </div>
            <div>
              <label className="label-compact">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as StackStatus)} className="input-gcp">
                <option value="Em Uso">Em Uso</option>
                <option value="Em Migração">Em Migração</option>
                <option value="Descontinuado">Descontinuado</option>
                <option value="Em Avaliação">Em Avaliação</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-compact">Observação</label>
            <input type="text" value={observacao} onChange={e => setObservacao(e.target.value)}
              placeholder="Observação adicional..." className="input-gcp" />
          </div>
          <div className="flex justify-end gap-2 pt-1 border-t" style={{ borderColor: "var(--border)" }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-[11px]">Cancelar</button>
            <button type="submit" className="btn-primary text-[11px]">Adicionar</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-1.5">
        {stacks.length === 0 ? (
          <p className="text-[12px] text-center py-4" style={{ color: "var(--text-muted)" }}>
            Nenhuma tecnologia cadastrada.
          </p>
        ) : (
          stacks.map(stack => {
            const catStyle = CATEGORIA_STYLES[stack.categoria] || CATEGORIA_STYLES.linguagem;
            const stStyle = STATUS_STYLES[stack.status] || STATUS_STYLES['Em Uso'];
            return (
              <div key={stack.id} className="group flex items-center justify-between rounded border px-3 py-2"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0"
                    style={{ backgroundColor: catStyle.bg, color: catStyle.color }}>
                    {CATEGORIA_LABELS[stack.categoria]}
                  </span>
                  <span className="font-medium text-[12px]" style={{ color: "var(--text-primary)" }}>
                    {stack.nome}
                  </span>
                  <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                    v{stack.versao}
                  </span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: stStyle.bg, color: stStyle.color }}>
                    {stack.status}
                  </span>
                  {stack.observacao && (
                    <span className="text-[11px] hidden md:block truncate max-w-[200px]" style={{ color: "var(--text-secondary)" }}>
                      — {stack.observacao}
                    </span>
                  )}
                </div>
                <button onClick={() => onDelete(stack.id)}
                  className="opacity-0 group-hover:opacity-100 shrink-0 p-0.5 rounded transition-opacity"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--gcp-red)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                  <Trash2 size={11} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
