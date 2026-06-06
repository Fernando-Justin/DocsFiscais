"use client";

import React, { useState, useEffect } from 'react';
import { SubModule } from '@/domain/entities/SubModule';

interface SubModuleFormProps {
  applicationId: string;
  initialData?: SubModule | null;
  onSubmit: (data: Omit<SubModule, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function SubModuleForm({ applicationId, initialData, onSubmit, onCancel }: SubModuleFormProps) {
  const [nome, setNome] = useState('');
  const [proposito, setProposito] = useState('');

  useEffect(() => {
    if (initialData) { setNome(initialData.nome || ''); setProposito(initialData.proposito || ''); }
    else { setNome(''); setProposito(''); }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    onSubmit({ id: initialData?.id, application_id: applicationId, nome, proposito: proposito || null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label-compact">Nome do Submódulo *</label>
          <input type="text" required value={nome} onChange={e => setNome(e.target.value)}
            placeholder="Ex: Anti-fraud Analyzer" className="input-gcp" />
        </div>
        <div>
          <label className="label-compact">Propósito</label>
          <input type="text" value={proposito} onChange={e => setProposito(e.target.value)}
            placeholder="Propósito técnico do módulo" className="input-gcp" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1.5 border-t" style={{ borderColor: "var(--border)" }}>
        <button type="button" onClick={onCancel} className="btn-secondary text-[11px]">Cancelar</button>
        <button type="submit" className="btn-primary text-[11px]">Salvar</button>
      </div>
    </form>
  );
}
