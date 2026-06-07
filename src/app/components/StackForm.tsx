"use client";

import React, { useState } from 'react';
import { Stack, StackCategoria, StackStatus } from '@/domain/entities/Stack';
import { Plus, Trash2 } from 'lucide-react';
import { getStatusStyle } from './statusStyles';

interface StackFormProps {
  applicationId: string;
  stacks: Stack[];
  onSave: (data: Omit<Stack, 'id'> & { id?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const CATEGORIA_LABELS: Record<StackCategoria, string> = {
  'Linguagem': 'Linguagem',
  'Framework': 'Framework',
  'Banco de Dados': 'Banco de Dados',
  'Infraestrutura': 'Infraestrutura',
  'Mensageria': 'Mensageria',
  'Observabilidade': 'Observabilidade',
  'Segurança': 'Segurança',
  'Outro': 'Outro',
};

const CATEGORIA_STYLES: Record<string, { bg: string; color: string }> = {
  'Linguagem': { bg: 'var(--blue-light)', color: 'var(--blue-primary)' },
  'Framework': { bg: 'var(--gcp-green-bg)', color: 'var(--gcp-green)' },
  'Banco de Dados': { bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' },
  'Infraestrutura': { bg: 'var(--bg-hover)', color: 'var(--text-secondary)' },
  'Mensageria': { bg: '#F3E5FF', color: 'var(--gcp-purple)' },
  'Observabilidade': { bg: '#E8F5E9', color: '#2E7D32' },
  'Segurança': { bg: 'var(--gcp-red-bg)', color: 'var(--gcp-red)' },
  'Outro': { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
};

export default function StackForm({ applicationId, stacks, onSave, onDelete }: StackFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [versao, setVersao] = useState('');
  const [categoria, setCategoria] = useState<StackCategoria>('Linguagem');
  const [status, setStatus] = useState<StackStatus>('Ativo');
  const [observacao, setObservacao] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    await onSave({
      application_id: applicationId,
      nome: nome.trim(), versao: versao.trim(), categoria, status,
      observacao: observacao.trim() || null,
    });
    setNome(''); setVersao(''); setCategoria('Linguagem');
    setStatus('Ativo'); setObservacao('');
    setShowForm(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
          Stack Tecnológica ({stacks.length})
        </span>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 text-[11px] font-medium" style={{ color: 'var(--blue-primary)' }}>
          <Plus size={11} /> {showForm ? 'Fechar' : 'Adicionar Tecnologia'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border p-3 space-y-2"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                {Object.entries(CATEGORIA_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="label-compact">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as StackStatus)} className="input-gcp">
                <option value="Ativo">Ativo</option>
                <option value="Em atualização">Em atualização</option>
                <option value="Depreciado">Depreciado</option>
                <option value="Em avaliação">Em avaliação</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-compact">Observação</label>
            <input type="text" value={observacao} onChange={e => setObservacao(e.target.value)}
              placeholder="Observação adicional..." className="input-gcp" />
          </div>
          <div className="flex justify-end gap-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-[11px]">Cancelar</button>
            <button type="submit" className="btn-primary text-[11px]">Adicionar</button>
          </div>
        </form>
      )}

      <div className="rounded-lg border overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        {stacks.length === 0 ? (
          <p className="text-[12px] text-center py-6" style={{ color: 'var(--text-muted)' }}>
            Nenhuma tecnologia cadastrada.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-medium border-b"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-page)' }}>
                <th className="px-3 py-2">Tecnologia</th>
                <th className="px-3 py-2">Versão</th>
                <th className="px-3 py-2">Categoria</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Obs</th>
                <th className="px-3 py-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {stacks.map(stack => {
                const catStyle = CATEGORIA_STYLES[stack.categoria] || CATEGORIA_STYLES['Outro'];
                const stStyle = getStatusStyle(stack.status);
                return (
                  <tr key={stack.id} className="border-b group"
                    style={{ borderColor: 'var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                    <td className="px-3 py-2">
                      <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>{stack.nome}</span>
                    </td>
                    <td className="px-3 py-2 text-[12px] font-mono" style={{ color: 'var(--text-secondary)' }}>v{stack.versao}</td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: catStyle.bg, color: catStyle.color }}>
                        {CATEGORIA_LABELS[stack.categoria] || stack.categoria}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: stStyle.bg, color: stStyle.color }}>
                        {stack.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {stack.observacao || ''}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => onDelete(stack.id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 transition-opacity"
                        style={{ color: 'var(--gcp-red)' }}>
                        <Trash2 size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
