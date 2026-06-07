"use client";

import React, { useState, useEffect } from 'react';
import { Roadmap, Trimestre, RoadmapStatus } from '@/domain/entities/Roadmap';

interface RoadmapFormProps {
  applicationId: string;
  initialData?: Roadmap | null;
  onSubmit: (data: Omit<Roadmap, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function RoadmapForm({ applicationId, initialData, onSubmit, onCancel }: RoadmapFormProps) {
  const [atividade, setAtividade] = useState('');
  const [detalhamento, setDetalhamento] = useState('');
  const [dataPrevistaFinalizacao, setDataPrevistaFinalizacao] = useState('');
  const [trimestre, setTrimestre] = useState<Trimestre>('Q1');
  const [ano, setAno] = useState<number>(2026);
  const [status, setStatus] = useState<RoadmapStatus>('Backlog');

  useEffect(() => {
    if (initialData) {
      setAtividade(initialData.atividade || '');
      setDetalhamento(initialData.detalhamento || '');
      setDataPrevistaFinalizacao(initialData.data_prevista_finalizacao || '');
      setTrimestre(initialData.trimestre || 'Q1');
      setAno(initialData.ano || 2026);
      setStatus(initialData.status || 'Backlog');
    } else { setAtividade(''); setDetalhamento(''); setDataPrevistaFinalizacao(''); setTrimestre('Q1'); setAno(2026); setStatus('Backlog'); }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!atividade.trim()) return;
    onSubmit({
      id: initialData?.id,
      application_id: applicationId,
      atividade: atividade.trim(),
      detalhamento: detalhamento.trim() || null,
      data_prevista_finalizacao: dataPrevistaFinalizacao || null,
      trimestre,
      ano,
      status,
    });
  };

  return (
    <div className="rounded-lg border p-3"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--border)" }}>
          <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
            {initialData ? 'Editar Atividade' : 'Nova Atividade do Roadmap'}
          </span>
          <button type="button" onClick={onCancel} className="text-[11px]" style={{ color: "var(--text-muted)" }}>Cancelar</button>
        </div>

        <div>
          <label className="label-compact">Atividade Macro *</label>
          <input type="text" required value={atividade} onChange={e => setAtividade(e.target.value)}
            placeholder="Ex: Upgrade de Segurança PCI-DSS" className="input-gcp" />
        </div>

        <div>
          <label className="label-compact">Detalhamento</label>
          <textarea value={detalhamento} onChange={e => setDetalhamento(e.target.value)}
            placeholder="Descrição detalhada da atividade, entregas esperadas e observações..."
            rows={3} className="input-gcp resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label-compact">Data Prevista de Finalização</label>
            <input type="date" value={dataPrevistaFinalizacao} onChange={e => setDataPrevistaFinalizacao(e.target.value)}
              className="input-gcp" />
          </div>
          <div>
            <label className="label-compact">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as RoadmapStatus)} className="input-gcp">
              <option value="Backlog">Backlog</option>
              <option value="In Progress">Em Andamento</option>
              <option value="Homologação">Homologação</option>
              <option value="Bloqueado">Bloqueado</option>
              <option value="Done">Concluído</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
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
        </div>

        <div className="flex justify-end gap-2 pt-1.5 border-t" style={{ borderColor: "var(--border)" }}>
          <button type="button" onClick={onCancel} className="btn-secondary text-[11px]">Cancelar</button>
          <button type="submit" className="btn-primary text-[11px]">Salvar Atividade</button>
        </div>
      </form>
    </div>
  );
}
