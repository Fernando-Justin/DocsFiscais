"use client";

import React, { useState } from 'react';
import { Cliente, ClienteStatus, ClienteEndpoint } from '@/domain/entities/Cliente';
import { ClienteAtividade, AtividadeStatus } from '@/domain/entities/ClienteAtividade';
import { Endpoint } from '@/domain/entities/Endpoint';
import { getStatusStyle } from './statusStyles';
import {
  Plus, Trash2, ChevronDown, ChevronRight, Edit,
  Users, ExternalLink, Server
} from 'lucide-react';

interface ClienteSectionProps {
  applicationId: string;
  clientes: Cliente[];
  endpoints: Endpoint[];
  onSaveCliente: (data: Omit<Cliente, 'id'> & { id?: string }) => Promise<void>;
  onDeleteCliente: (id: string) => Promise<void>;
  onSaveAtividade: (clienteId: string, data: Omit<ClienteAtividade, 'id'> & { id?: string }) => Promise<void>;
  onDeleteAtividade: (id: string) => Promise<void>;
  atividadesMap: Record<string, ClienteAtividade[]>;
  onLoadAtividades: (clienteId: string) => Promise<void>;
}

export default function ClienteSection({
  applicationId, clientes, endpoints, onSaveCliente, onDeleteCliente,
  onSaveAtividade, onDeleteAtividade, atividadesMap, onLoadAtividades
}: ClienteSectionProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedCliente, setExpandedCliente] = useState<string | null>(null);
  const [expandedTab, setExpandedTab] = useState<'atividades' | 'endpoints'>('atividades');

  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [areaReferencia, setAreaReferencia] = useState('');
  const [contato, setContato] = useState('');
  const [status, setStatus] = useState<ClienteStatus>('Ativo');

  const [showAtividadeForm, setShowAtividadeForm] = useState<string | null>(null);
  const [atvDescritivo, setAtvDescritivo] = useState('');
  const [atvStatus, setAtvStatus] = useState<AtividadeStatus>('Pendente');
  const [atvDataInicio, setAtvDataInicio] = useState('');
  const [atvDataConclusao, setAtvDataConclusao] = useState('');
  const [atvObservacao, setAtvObservacao] = useState('');

  const handleCreateCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaReferencia.trim() || !contato.trim()) return;
    await onSaveCliente({
      application_id: applicationId,
      nome_empresa: nomeEmpresa.trim() || areaReferencia.trim(),
      area_referencia: areaReferencia.trim(),
      contato: contato.trim(),
      status,
      endpoints: [],
    });
    setNomeEmpresa(''); setAreaReferencia(''); setContato('');
    setStatus('Ativo'); setShowCreateForm(false);
  };

  const handleToggleExpand = async (clienteId: string) => {
    if (expandedCliente === clienteId) {
      setExpandedCliente(null);
    } else {
      setExpandedCliente(clienteId);
      if (!atividadesMap[clienteId]) {
        await onLoadAtividades(clienteId);
      }
    }
  };

  const handleAddAtividade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!atvDescritivo.trim() || !showAtividadeForm) return;
    await onSaveAtividade(showAtividadeForm, {
      cliente_id: showAtividadeForm,
      descritivo: atvDescritivo.trim(),
      status: atvStatus,
      data_prevista_inicio: atvDataInicio || null,
      data_prevista_conclusao: atvDataConclusao || null,
      observacao: atvObservacao.trim() || null,
    });
    setAtvDescritivo(''); setAtvStatus('Pendente');
    setAtvDataInicio(''); setAtvDataConclusao(''); setAtvObservacao('');
    setShowAtividadeForm(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
          Clientes ({clientes.length})
        </span>
        <button onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-1 text-[11px] font-medium" style={{ color: 'var(--blue-primary)' }}>
          <Plus size={11} /> {showCreateForm ? 'Fechar' : 'Novo Cliente'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateCliente} className="rounded-lg border p-3 space-y-2"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label-compact">Empresa</label>
              <input type="text" value={nomeEmpresa} onChange={e => setNomeEmpresa(e.target.value)}
                placeholder="Nome da empresa" className="input-gcp" />
            </div>
            <div>
              <label className="label-compact">Área de Referência *</label>
              <input type="text" required value={areaReferencia} onChange={e => setAreaReferencia(e.target.value)}
                placeholder="Squad, Vertical..." className="input-gcp" />
            </div>
            <div>
              <label className="label-compact">Contato *</label>
              <input type="text" required value={contato} onChange={e => setContato(e.target.value)}
                placeholder="Nome - email@company.com" className="input-gcp" />
            </div>
            <div>
              <label className="label-compact">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as ClienteStatus)} className="input-gcp">
                <option value="Ativo">Ativo</option>
                <option value="Em Homologação">Em Homologação</option>
                <option value="Bloqueado">Bloqueado</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
            <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary text-[11px]">Cancelar</button>
            <button type="submit" className="btn-primary text-[11px]">Adicionar Cliente</button>
          </div>
        </form>
      )}

      {clientes.length === 0 ? (
        <p className="text-[12px] text-center py-4" style={{ color: 'var(--text-muted)' }}>
          Nenhum cliente cadastrado.
        </p>
      ) : (
        <div className="space-y-1.5">
          {clientes.map(cliente => {
            const stStyle = getStatusStyle(cliente.status);
            const isExpanded = expandedCliente === cliente.id;
            const atividades = atividadesMap[cliente.id] || [];
            const clienteEndpoints = endpoints.filter(ep => cliente.endpoints?.some(ce => ce.endpoint_id === ep.id));

            return (
              <div key={cliente.id} className="rounded-lg border overflow-hidden"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div onClick={() => handleToggleExpand(cliente.id)}
                  className="flex items-center justify-between px-3 py-2.5 cursor-pointer group transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Users size={14} style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <div className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
                        {cliente.nome_empresa || cliente.area_referencia}
                      </div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        {cliente.area_referencia} — {cliente.contato}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: stStyle.bg, color: stStyle.color }}>
                      {cliente.status}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteCliente(cliente.id); }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 transition-opacity"
                      style={{ color: 'var(--gcp-red)' }}>
                      <Trash2 size={11} />
                    </button>
                    {isExpanded ? <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
                      : <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-page)' }}>
                    {/* Sub-abas internas */}
                    <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
                      {(['atividades', 'endpoints'] as const).map(tab => (
                        <button key={tab} onClick={() => setExpandedTab(tab)}
                          className="px-3 py-1.5 text-[11px] font-medium border-b-2 transition-colors"
                          style={{
                            borderBottomColor: expandedTab === tab ? 'var(--blue-primary)' : 'transparent',
                            color: expandedTab === tab ? 'var(--blue-primary)' : 'var(--text-secondary)',
                          }}>
                          {tab === 'atividades' ? `Atividades (${atividades.length})` : `Endpoints (${clienteEndpoints.length})`}
                        </button>
                      ))}
                    </div>

                    <div className="p-3 space-y-2">
                      {/* Atividades */}
                      {expandedTab === 'atividades' && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>
                              Atividades e Evoluções
                            </span>
                            <button onClick={(e) => { e.stopPropagation(); setShowAtividadeForm(showAtividadeForm === cliente.id ? null : cliente.id); }}
                              className="flex items-center gap-1 text-[10px] font-medium" style={{ color: 'var(--blue-primary)' }}>
                              <Plus size={10} /> Nova Atividade
                            </button>
                          </div>

                          {showAtividadeForm === cliente.id && (
                            <form onSubmit={handleAddAtividade} className="rounded border p-2 mb-2 space-y-1.5"
                              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                              <div>
                                <label className="label-compact">Descritivo *</label>
                                <input type="text" required value={atvDescritivo} onChange={e => setAtvDescritivo(e.target.value)}
                                  placeholder="Descreva a necessidade..." className="input-gcp" />
                              </div>
                              <div className="grid grid-cols-4 gap-1.5">
                                <div>
                                  <label className="label-compact">Status</label>
                                  <select value={atvStatus} onChange={e => setAtvStatus(e.target.value as AtividadeStatus)} className="input-gcp">
                                    <option value="Pendente">Pendente</option>
                                    <option value="Em análise">Em análise</option>
                                    <option value="Em desenvolvimento">Em desenvolvimento</option>
                                    <option value="Concluído">Concluído</option>
                                    <option value="Recusado">Recusado</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="label-compact">Início</label>
                                  <input type="date" value={atvDataInicio} onChange={e => setAtvDataInicio(e.target.value)} className="input-gcp" />
                                </div>
                                <div>
                                  <label className="label-compact">Conclusão</label>
                                  <input type="date" value={atvDataConclusao} onChange={e => setAtvDataConclusao(e.target.value)} className="input-gcp" />
                                </div>
                                <div>
                                  <label className="label-compact">Obs</label>
                                  <input type="text" value={atvObservacao} onChange={e => setAtvObservacao(e.target.value)}
                                    placeholder="Observação" className="input-gcp" />
                                </div>
                              </div>
                              <div className="flex justify-end gap-1.5">
                                <button type="button" onClick={() => setShowAtividadeForm(null)} className="btn-secondary text-[10px]">Cancelar</button>
                                <button type="submit" className="btn-primary text-[10px]">Salvar</button>
                              </div>
                            </form>
                          )}

                          {atividades.length === 0 ? (
                            <p className="text-[11px] py-2 text-center" style={{ color: 'var(--text-muted)' }}>
                              Nenhuma atividade registrada.
                            </p>
                          ) : (
                            <div className="space-y-1">
                              {atividades.map(atv => {
                                const atvStyle = getStatusStyle(atv.status);
                                return (
                                  <div key={atv.id} className="group flex items-center justify-between rounded border px-2.5 py-1.5"
                                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                                      <span className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>
                                        {atv.descritivo}
                                      </span>
                                      <span className="text-[9px] font-medium px-1 py-0.5 rounded shrink-0"
                                        style={{ backgroundColor: atvStyle.bg, color: atvStyle.color }}>
                                        {atv.status}
                                      </span>
                                      {atv.data_prevista_inicio && (
                                        <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>
                                          {atv.data_prevista_inicio} → {atv.data_prevista_conclusao || '...'}
                                        </span>
                                      )}
                                      {atv.observacao && (
                                        <span className="text-[10px] truncate hidden md:block" style={{ color: 'var(--text-muted)' }}>
                                          — {atv.observacao}
                                        </span>
                                      )}
                                    </div>
                                    <button onClick={() => onDeleteAtividade(atv.id)}
                                      className="opacity-0 group-hover:opacity-100 p-0.5 shrink-0"
                                      style={{ color: 'var(--gcp-red)' }}>
                                      <Trash2 size={10} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Endpoints do Cliente */}
                      {expandedTab === 'endpoints' && (
                        <div>
                          <span className="text-[11px] font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                            Endpoints / Serviços Utilizados
                          </span>
                          {clienteEndpoints.length === 0 ? (
                            <p className="text-[11px] py-2 text-center" style={{ color: 'var(--text-muted)' }}>
                              Nenhum endpoint associado a este cliente.
                            </p>
                          ) : (
                            <div className="space-y-1">
                              {clienteEndpoints.map(ep => {
                                const ce = cliente.endpoints?.find(e => e.endpoint_id === ep.id);
                                return (
                                  <div key={ep.id} className="flex items-center justify-between rounded border px-2.5 py-1.5"
                                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                                    <div className="flex items-center gap-2">
                                      <Server size={12} style={{ color: 'var(--text-muted)' }} />
                                      <span className="font-mono text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>
                                        {ep.metodo} {ep.path}
                                      </span>
                                      {ce?.observacao && (
                                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                          — {ce.observacao}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
