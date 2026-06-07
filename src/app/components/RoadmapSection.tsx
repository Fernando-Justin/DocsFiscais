"use client";

import React, { useState } from 'react';
import { Roadmap, Trimestre, RoadmapStatus, RoadmapCategoria, RoadmapPrioridade } from '@/domain/entities/Roadmap';
import { getStatusStyle } from './statusStyles';
import {
  Plus, ChevronDown, ChevronRight, Edit, Trash2, Download,
  AlertTriangle, Flag, Calendar, User
} from 'lucide-react';

interface RoadmapSectionProps {
  applicationId: string;
  roadmap: Roadmap[];
  onSave: (data: Omit<Roadmap, 'id'> & { id?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const CATEGORIA_LABELS: Record<RoadmapCategoria, string> = {
  'Evolução técnica': 'Evolução Técnica',
  'Exigência fiscal/regulatória': 'Exigência Fiscal',
  'Demanda de cliente': 'Demanda de Cliente',
  'Correção / Débito técnico': 'Débito Técnico',
  'Infraestrutura': 'Infraestrutura',
};

const CATEGORIA_STYLES: Record<string, { bg: string; color: string }> = {
  'Evolução técnica': { bg: 'var(--blue-light)', color: 'var(--blue-primary)' },
  'Exigência fiscal/regulatória': { bg: '#FFF3E0', color: '#E65100' },
  'Demanda de cliente': { bg: 'var(--gcp-green-bg)', color: 'var(--gcp-green)' },
  'Correção / Débito técnico': { bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' },
  'Infraestrutura': { bg: 'var(--bg-hover)', color: 'var(--text-secondary)' },
};

const PRIORIDADE_STYLES: Record<string, { bg: string; color: string }> = {
  'Crítica': { bg: 'var(--gcp-red-bg)', color: 'var(--gcp-red)' },
  'Alta': { bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' },
  'Média': { bg: 'var(--blue-light)', color: 'var(--blue-primary)' },
  'Baixa': { bg: 'var(--bg-hover)', color: 'var(--text-muted)' },
};

export default function RoadmapSection({ applicationId, roadmap, onSave, onDelete }: RoadmapSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Roadmap | null>(null);

  const [atividade, setAtividade] = useState('');
  const [detalhamento, setDetalhamento] = useState('');
  const [categoria, setCategoria] = useState<RoadmapCategoria>('Evolução técnica');
  const [prioridade, setPrioridade] = useState<RoadmapPrioridade>('Média');
  const [status, setStatus] = useState<RoadmapStatus>('Backlog');
  const [trimestre, setTrimestre] = useState<Trimestre>('Q1');
  const [ano, setAno] = useState(2026);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const resetForm = () => {
    setAtividade(''); setDetalhamento(''); setCategoria('Evolução técnica');
    setPrioridade('Média'); setStatus('Backlog'); setTrimestre('Q1'); setAno(2026);
    setDataInicio(''); setDataFim(''); setResponsavel(''); setObservacoes('');
  };

  const handleEdit = (item: Roadmap) => {
    setEditing(item);
    setAtividade(item.atividade);
    setDetalhamento(item.detalhamento || '');
    setCategoria(item.categoria);
    setPrioridade(item.prioridade);
    setStatus(item.status);
    setTrimestre(item.trimestre);
    setAno(item.ano);
    setDataInicio(item.data_prevista_inicio || '');
    setDataFim(item.data_prevista_finalizacao || '');
    setResponsavel(item.responsavel || '');
    setObservacoes(item.observacoes || '');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!atividade.trim()) return;
    await onSave({
      id: editing?.id, application_id: applicationId,
      atividade: atividade.trim(), detalhamento: detalhamento.trim() || null,
      categoria, prioridade, status, trimestre, ano,
      data_prevista_inicio: dataInicio || null,
      data_prevista_finalizacao: dataFim || null,
      responsavel: responsavel.trim() || null,
      observacoes: observacoes.trim() || null,
    });
    resetForm();
    setShowForm(false);
    setEditing(null);
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const headers = ['Atividade', 'Detalhamento', 'Categoria', 'Prioridade', 'Status', 'Trimestre', 'Ano', 'Início', 'Fim', 'Responsável'];
    const rows = roadmap.map(r => [
      r.atividade, r.detalhamento || '', r.categoria, r.prioridade, r.status,
      r.trimestre, String(r.ano), r.data_prevista_inicio || '', r.data_prevista_finalizacao || '', r.responsavel || ''
    ]);
    const csv = [headers, ...rows].map(row => row.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `roadmap-export-${Date.now()}.csv`;
    a.click();
  };

  const roadmapByQuarter: Record<Trimestre, Roadmap[]> = { Q1: [], Q2: [], Q3: [], Q4: [] };
  roadmap.forEach(item => { if (roadmapByQuarter[item.trimestre]) roadmapByQuarter[item.trimestre].push(item); });

  const quarterLabels: Record<Trimestre, string> = { Q1: 'Jan–Mar', Q2: 'Abr–Jun', Q3: 'Jul–Set', Q4: 'Out–Dez' };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>Roadmap</h4>
          <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Planejamento estratégico de entregas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button className="btn-secondary flex items-center gap-1.5 text-[11px]">
              <Download size={11} /> Exportar
            </button>
            <div className="absolute right-0 top-full mt-1 rounded-lg border bg-[var(--bg-card)] shadow-md z-10 hidden group-hover:block"
              style={{ borderColor: 'var(--border)', minWidth: 120 }}>
              <button onClick={() => handleExport('csv')} className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-[var(--bg-hover)]">
                CSV
              </button>
              <button onClick={() => handleExport('excel')} className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-[var(--bg-hover)]">
                Excel
              </button>
              <button onClick={() => handleExport('pdf')} className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-[var(--bg-hover)]">
                PDF
              </button>
            </div>
          </div>
          <button onClick={() => { setEditing(null); resetForm(); setShowForm(!showForm); }}
            className="btn-primary flex items-center gap-1.5 text-[11px]">
            <Plus size={11} /> Nova Atividade
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border p-3 space-y-2"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
              {editing ? 'Editar Atividade' : 'Nova Atividade'}
            </span>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
              className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Cancelar</button>
          </div>
          <div>
            <label className="label-compact">Atividade Macro *</label>
            <input type="text" required value={atividade} onChange={e => setAtividade(e.target.value)}
              placeholder="Ex: Upgrade de Segurança PCI-DSS" className="input-gcp" />
          </div>
          <div>
            <label className="label-compact">Detalhamento</label>
            <textarea value={detalhamento} onChange={e => setDetalhamento(e.target.value)}
              placeholder="Descrição detalhada da atividade..." rows={2} className="input-gcp resize-none" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="label-compact">Categoria</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value as RoadmapCategoria)} className="input-gcp">
                {Object.entries(CATEGORIA_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="label-compact">Prioridade</label>
              <select value={prioridade} onChange={e => setPrioridade(e.target.value as RoadmapPrioridade)} className="input-gcp">
                {(['Crítica', 'Alta', 'Média', 'Baixa'] as RoadmapPrioridade[]).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label-compact">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as RoadmapStatus)} className="input-gcp">
                {(['Backlog', 'Planejado', 'Em andamento', 'Em homologação', 'Bloqueado', 'Concluído', 'Cancelado'] as RoadmapStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-compact">Responsável</label>
              <input type="text" value={responsavel} onChange={e => setResponsavel(e.target.value)}
                placeholder="Nome" className="input-gcp" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="label-compact">Trimestre</label>
              <select value={trimestre} onChange={e => setTrimestre(e.target.value as Trimestre)} className="input-gcp">
                <option value="Q1">Q1 (Jan–Mar)</option>
                <option value="Q2">Q2 (Abr–Jun)</option>
                <option value="Q3">Q3 (Jul–Set)</option>
                <option value="Q4">Q4 (Out–Dez)</option>
              </select>
            </div>
            <div>
              <label className="label-compact">Ano</label>
              <input type="number" required value={ano} onChange={e => setAno(Number(e.target.value))}
                min={2020} max={2035} className="input-gcp" />
            </div>
            <div>
              <label className="label-compact">Início Previsto</label>
              <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="input-gcp" />
            </div>
            <div>
              <label className="label-compact">Fim Previsto</label>
              <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="input-gcp" />
            </div>
          </div>
          <div>
            <label className="label-compact">Observações</label>
            <input type="text" value={observacoes} onChange={e => setObservacoes(e.target.value)}
              placeholder="Observações adicionais..." className="input-gcp" />
          </div>
          <div className="flex justify-end gap-2 pt-1.5 border-t" style={{ borderColor: 'var(--border)' }}>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-secondary text-[11px]">Cancelar</button>
            <button type="submit" className="btn-primary text-[11px]">{editing ? 'Atualizar' : 'Salvar'}</button>
          </div>
        </form>
      )}

      {/* Quadros por trimestre */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(['Q1', 'Q2', 'Q3', 'Q4'] as Trimestre[]).map(quarter => {
          const items = roadmapByQuarter[quarter];
          return (
            <div key={quarter} className="rounded-lg border overflow-hidden flex flex-col"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center justify-between px-2.5 py-2 border-b"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-hover)' }}>
                <div>
                  <span className="font-bold text-[12px]" style={{ color: 'var(--text-primary)' }}>{quarter}</span>
                  <span className="text-[10px] ml-1.5" style={{ color: 'var(--text-muted)' }}>{quarterLabels[quarter]}</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  {items.length}
                </span>
              </div>
              <div className="flex-1 p-2 space-y-1.5 overflow-y-auto" style={{ maxHeight: 420 }}>
                {items.length === 0 ? (
                  <div className="text-center py-6 text-[11px] rounded border border-dashed"
                    style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                    Nenhuma atividade
                  </div>
                ) : items.map(item => {
                  const catStyle = CATEGORIA_STYLES[item.categoria] || CATEGORIA_STYLES['Evolução técnica'];
                  const prioStyle = PRIORIDADE_STYLES[item.prioridade] || PRIORIDADE_STYLES['Média'];
                  const stStyle = getStatusStyle(item.status);
                  const isFiscal = item.categoria === 'Exigência fiscal/regulatória';
                  return (
                    <div key={item.id} className="group rounded border p-2 flex flex-col gap-1.5 transition-colors"
                      style={{ backgroundColor: 'var(--bg-page)', borderColor: isFiscal ? '#E65100' : 'var(--border)', borderLeftWidth: isFiscal ? 3 : 1, borderLeftColor: isFiscal ? '#E65100' : undefined }}>
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-[12px] font-medium leading-snug flex-1" style={{ color: 'var(--text-primary)' }}>
                          {item.atividade}
                        </p>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 shrink-0">
                          <button onClick={() => handleEdit(item)} style={{ color: 'var(--blue-primary)' }}><Edit size={10} /></button>
                          <button onClick={() => onDelete(item.id)} style={{ color: 'var(--gcp-red)' }}><Trash2 size={10} /></button>
                        </div>
                      </div>
                      {item.detalhamento && (
                        <p className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>{item.detalhamento}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[9px] font-medium px-1 py-0.5 rounded"
                          style={{ backgroundColor: catStyle.bg, color: catStyle.color }}>
                          {item.categoria === 'Exigência fiscal/regulatória' ? '⚠ Fiscal' : CATEGORIA_LABELS[item.categoria]}
                        </span>
                        <span className="text-[9px] font-medium px-1 py-0.5 rounded"
                          style={{ backgroundColor: prioStyle.bg, color: prioStyle.color }}>
                          {item.prioridade}
                        </span>
                        <span className="text-[9px] font-medium px-1 py-0.5 rounded"
                          style={{ backgroundColor: stStyle.bg, color: stStyle.color }}>
                          {item.status}
                        </span>
                        {item.responsavel && (
                          <span className="text-[9px] font-mono px-1 py-0.5 rounded flex items-center gap-0.5"
                            style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                            <User size={8} /> {item.responsavel}
                          </span>
                        )}
                      </div>
                      {(item.data_prevista_inicio || item.data_prevista_finalizacao) && (
                        <div className="flex items-center gap-2 text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>
                          <Calendar size={8} />
                          {item.data_prevista_inicio && <span>{item.data_prevista_inicio}</span>}
                          {item.data_prevista_inicio && item.data_prevista_finalizacao && <span>→</span>}
                          {item.data_prevista_finalizacao && <span>{item.data_prevista_finalizacao}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
