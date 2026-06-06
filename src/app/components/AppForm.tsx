"use client";

import React, { useState, useEffect } from 'react';
import { Application } from '@/domain/entities/Application';

interface AppFormProps {
  initialData?: Application | null;
  onSubmit: (data: Omit<Application, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function AppForm({ initialData, onSubmit, onCancel }: AppFormProps) {
  const [nome, setNome] = useState('');
  const [linkConfluence, setLinkConfluence] = useState('');
  const [ambienteHml, setAmbienteHml] = useState('');
  const [ambientePrd, setAmbientePrd] = useState('');
  const [proposito, setProposito] = useState('');
  const [escopo, setEscopo] = useState('');

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome || '');
      setLinkConfluence(initialData.link_confluence || '');
      setAmbienteHml(initialData.ambiente_hml || '');
      setAmbientePrd(initialData.ambiente_prd || '');
      setProposito(initialData.proposito || '');
      setEscopo(initialData.escopo || '');
    } else {
      setNome(''); setLinkConfluence(''); setAmbienteHml('');
      setAmbientePrd(''); setProposito(''); setEscopo('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    onSubmit({
      id: initialData?.id,
      nome,
      link_confluence: linkConfluence || null,
      ambiente_hml: ambienteHml || null,
      ambiente_prd: ambientePrd || null,
      proposito: proposito || null,
      escopo: escopo || null,
    });
  };

  return (
    <div className="rounded-lg border overflow-hidden"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-hover)" }}>
        <div>
          <h3 className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
            {initialData ? 'Editar Aplicação' : 'Nova Aplicação'}
          </h3>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Preencha as informações técnicas da aplicação do ecossistema.
          </p>
        </div>
        <button onClick={onCancel} className="btn-secondary text-[11px]">Cancelar</button>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="grid grid-cols-2 gap-3">
          
          <div className="col-span-2">
            <label className="label-compact">Nome da Aplicação *</label>
            <input
              type="text" required value={nome} onChange={e => setNome(e.target.value)}
              placeholder="Ex: Payment Gateway API"
              className="input-gcp"
            />
          </div>

          <div>
            <label className="label-compact">URL de Produção (PRD)</label>
            <input
              type="url" value={ambientePrd} onChange={e => setAmbientePrd(e.target.value)}
              placeholder="https://api.company.com"
              className="input-gcp"
            />
          </div>

          <div>
            <label className="label-compact">URL de Homologação (HML)</label>
            <input
              type="url" value={ambienteHml} onChange={e => setAmbienteHml(e.target.value)}
              placeholder="https://hml-api.company.com"
              className="input-gcp"
            />
          </div>

          <div className="col-span-2">
            <label className="label-compact">Link do Confluence</label>
            <input
              type="url" value={linkConfluence} onChange={e => setLinkConfluence(e.target.value)}
              placeholder="https://confluence.company.com/pages/..."
              className="input-gcp"
            />
          </div>

          <div className="col-span-2">
            <label className="label-compact">Propósito</label>
            <textarea
              value={proposito} onChange={e => setProposito(e.target.value)}
              placeholder="Descreva o propósito desta aplicação no ecossistema..."
              rows={2} className="input-gcp resize-none"
            />
          </div>

          <div className="col-span-2">
            <label className="label-compact">Escopo Técnico</label>
            <textarea
              value={escopo} onChange={e => setEscopo(e.target.value)}
              placeholder="Tecnologias, responsabilidades e dependências..."
              rows={2} className="input-gcp resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
          <button type="submit" className="btn-primary">
            {initialData ? 'Atualizar' : 'Criar Aplicação'}
          </button>
        </div>
      </form>
    </div>
  );
}
