"use client";

import React, { useState } from 'react';
import { Endpoint, EndpointStatus, AmbienteDisponivel } from '@/domain/entities/Endpoint';
import { SubModule } from '@/domain/entities/SubModule';
import { ConfluenceReference, ConfluenceCategoria } from '@/domain/entities/ConfluenceReference';
import { METHOD_STYLES, getStatusStyle } from './statusStyles';
import {
  ChevronDown, ChevronRight, Plus, Trash2, Edit, Copy, Check,
  ExternalLink, Shield, Globe, Server
} from 'lucide-react';

interface DocumentationSectionProps {
  applicationId: string;
  subModules: SubModule[];
  endpoints: Endpoint[];
  confluenceReferences: ConfluenceReference[];
  onSaveSubModule: (data: Omit<SubModule, 'id'> & { id?: string }) => Promise<void>;
  onDeleteSubModule: (id: string) => Promise<void>;
  onSaveEndpoint: (data: Omit<Endpoint, 'id'> & { id?: string }) => Promise<void>;
  onDeleteEndpoint: (id: string) => Promise<void>;
  onSaveConfluenceRef: (data: Omit<ConfluenceReference, 'id'> & { id?: string }) => Promise<void>;
  onDeleteConfluenceRef: (id: string) => Promise<void>;
}

const CONFLUENCE_CATEGORIA_LABELS: Record<ConfluenceCategoria, string> = {
  'Arquitetura': 'Arquitetura',
  'Manual do usuário': 'Manual do Usuário',
  'Processo': 'Processo',
  'Runbook': 'Runbook',
  'ADR': 'ADR',
  'Outro': 'Outro',
};

const AMBIENTE_STYLES: Record<string, { bg: string; color: string }> = {
  'Produção': { bg: 'var(--gcp-green-bg)', color: 'var(--gcp-green)' },
  'Homologação': { bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' },
  'Ambos': { bg: 'var(--blue-light)', color: 'var(--blue-primary)' },
};

export default function DocumentationSection({
  applicationId, subModules, endpoints, confluenceReferences,
  onSaveSubModule, onDeleteSubModule, onSaveEndpoint, onDeleteEndpoint,
  onSaveConfluenceRef, onDeleteConfluenceRef
}: DocumentationSectionProps) {
  const [expandedEndpoints, setExpandedEndpoints] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSubSection, setActiveSubSection] = useState<'endpoints' | 'confluence'>('endpoints');

  const [showSubModuleForm, setShowSubModuleForm] = useState(false);
  const [showEndpointForm, setShowEndpointForm] = useState(false);
  const [showConfluenceForm, setShowConfluenceForm] = useState(false);
  const [editingSubModule, setEditingSubModule] = useState<SubModule | null>(null);
  const [editingEndpoint, setEditingEndpoint] = useState<Endpoint | null>(null);
  const [editingConfluence, setEditingConfluence] = useState<ConfluenceReference | null>(null);

  const [smNome, setSmNome] = useState('');
  const [smProposito, setSmProposito] = useState('');

  const [epMetodo, setEpMetodo] = useState('GET');
  const [epPath, setEpPath] = useState('');
  const [epDescricao, setEpDescricao] = useState('');
  const [epSubmoduleId, setEpSubmoduleId] = useState('');
  const [epPayload, setEpPayload] = useState('');
  const [epResponse, setEpResponse] = useState('');
  const [epStatusCodes, setEpStatusCodes] = useState('');
  const [epAuth, setEpAuth] = useState(false);
  const [epAuthTipo, setEpAuthTipo] = useState('');
  const [epAmbiente, setEpAmbiente] = useState<'Produção' | 'Homologação' | 'Ambos'>('Ambos');
  const [epStatus, setEpStatus] = useState<'Ativo' | 'Depreciado' | 'Em desenvolvimento'>('Ativo');
  const [epCurl, setEpCurl] = useState('');
  const [epParams, setEpParams] = useState('');

  const [crTitulo, setCrTitulo] = useState('');
  const [crUrl, setCrUrl] = useState('');
  const [crCategoria, setCrCategoria] = useState<ConfluenceCategoria>('Arquitetura');
  const [crDescricao, setCrDescricao] = useState('');
  const [crData, setCrData] = useState('');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetEndpointForm = () => {
    setEpMetodo('GET'); setEpPath(''); setEpDescricao(''); setEpSubmoduleId('');
    setEpPayload(''); setEpResponse(''); setEpStatusCodes(''); setEpAuth(false);
    setEpAuthTipo(''); setEpAmbiente('Ambos'); setEpStatus('Ativo'); setEpCurl(''); setEpParams('');
  };

  const resetConfluenceForm = () => {
    setCrTitulo(''); setCrUrl(''); setCrCategoria('Arquitetura'); setCrDescricao(''); setCrData('');
  };

  const handleSaveSubModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smNome.trim()) return;
    await onSaveSubModule({ id: editingSubModule?.id, application_id: applicationId, nome: smNome.trim(), proposito: smProposito.trim() || null });
    setSmNome(''); setSmProposito(''); setShowSubModuleForm(false); setEditingSubModule(null);
  };

  const handleSaveEndpointSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!epPath.trim()) return;
    await onSaveEndpoint({
      id: editingEndpoint?.id, application_id: applicationId, submodule_id: epSubmoduleId || null,
      metodo: epMetodo, path: epPath.trim(), descricao: epDescricao.trim() || null,
      parametros: epParams || null, payload_exemplo: epPayload || null,
      exemplo_response: epResponse || null, status_codes: epStatusCodes || null,
      auth_exigida: epAuth, auth_tipo: epAuthTipo || null, ambiente_disponivel: epAmbiente,
      status: epStatus, comando_curl: epCurl || null,
    });
    resetEndpointForm(); setShowEndpointForm(false); setEditingEndpoint(null);
  };

  const handleSaveConfluenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crTitulo.trim() || !crUrl.trim()) return;
    await onSaveConfluenceRef({
      id: editingConfluence?.id, application_id: applicationId,
      titulo: crTitulo.trim(), url: crUrl.trim(), categoria: crCategoria,
      descricao: crDescricao.trim() || null, ultima_atualizacao: crData || null,
    });
    resetConfluenceForm(); setShowConfluenceForm(false); setEditingConfluence(null);
  };

  return (
    <div className="space-y-3">
      {/* Sub-navegação interna */}
      <div className="flex border-b gap-0" style={{ borderColor: 'var(--border)' }}>
        {(['endpoints', 'confluence'] as const).map(sub => (
          <button key={sub} onClick={() => setActiveSubSection(sub)}
            className="px-3 py-2 text-[12px] font-medium border-b-2 transition-colors"
            style={{
              borderBottomColor: activeSubSection === sub ? 'var(--blue-primary)' : 'transparent',
              color: activeSubSection === sub ? 'var(--blue-primary)' : 'var(--text-secondary)',
            }}>
            {sub === 'endpoints' ? `Endpoints (${endpoints.length})` : `Confluence (${confluenceReferences.length})`}
          </button>
        ))}
      </div>

      {/* Seção de Endpoints */}
      {activeSubSection === 'endpoints' && (
        <div className="space-y-3">
          {/* Submódulos */}
          <div className="rounded-lg border overflow-hidden"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between px-3 py-2 border-b"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-hover)' }}>
              <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
                Submódulos ({subModules.length})
              </span>
              <button onClick={() => { setEditingSubModule(null); setSmNome(''); setSmProposito(''); setShowSubModuleForm(!showSubModuleForm); }}
                className="flex items-center gap-1 text-[11px] font-medium" style={{ color: 'var(--blue-primary)' }}>
                <Plus size={11} /> Novo Submódulo
              </button>
            </div>
            {showSubModuleForm && (
              <form onSubmit={handleSaveSubModuleSubmit} className="p-3 border-b space-y-2" style={{ borderColor: 'var(--border)' }}>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="label-compact">Nome *</label><input type="text" required value={smNome} onChange={e => setSmNome(e.target.value)} className="input-gcp" placeholder="Ex: Auth" /></div>
                  <div><label className="label-compact">Propósito</label><input type="text" value={smProposito} onChange={e => setSmProposito(e.target.value)} className="input-gcp" placeholder="Descrição do módulo" /></div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => { setShowSubModuleForm(false); setEditingSubModule(null); }} className="btn-secondary text-[11px]">Cancelar</button>
                  <button type="submit" className="btn-primary text-[11px]">Salvar</button>
                </div>
              </form>
            )}
            {subModules.length > 0 && (
              <div className="p-3 flex flex-wrap gap-2">
                {subModules.map(sm => (
                  <div key={sm.id} className="group flex items-center gap-1.5 rounded border px-2 py-1"
                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border)' }}>
                    <span className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>{sm.nome}</span>
                    <button onClick={() => onDeleteSubModule(sm.id)} className="opacity-0 group-hover:opacity-100"
                      style={{ color: 'var(--gcp-red)' }}><Trash2 size={10} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lista de Endpoints (Swagger-style) */}
          <div className="rounded-lg border overflow-hidden"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between px-3 py-2 border-b"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-hover)' }}>
              <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
                Endpoints da API ({endpoints.length})
              </span>
              <button onClick={() => { setEditingEndpoint(null); resetEndpointForm(); setShowEndpointForm(!showEndpointForm); }}
                className="flex items-center gap-1 text-[11px] font-medium" style={{ color: 'var(--blue-primary)' }}>
                <Plus size={11} /> Novo Endpoint
              </button>
            </div>

            {showEndpointForm && (
              <form onSubmit={handleSaveEndpointSubmit} className="p-3 border-b space-y-2" style={{ borderColor: 'var(--border)' }}>
                <div className="grid grid-cols-6 gap-2">
                  <div className="col-span-1">
                    <label className="label-compact">Método *</label>
                    <select value={epMetodo} onChange={e => setEpMetodo(e.target.value)} className="input-gcp font-mono"
                      style={{ color: (METHOD_STYLES[epMetodo]?.color || 'var(--text-primary)'), fontWeight: 600 }}>
                      {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="col-span-5">
                    <label className="label-compact">Path *</label>
                    <input type="text" required value={epPath} onChange={e => setEpPath(e.target.value)}
                      placeholder="/api/v1/..." className="input-gcp font-mono" />
                  </div>
                  <div className="col-span-3">
                    <label className="label-compact">Submódulo</label>
                    <select value={epSubmoduleId} onChange={e => setEpSubmoduleId(e.target.value)} className="input-gcp">
                      <option value="">Nenhum</option>
                      {subModules.map(sm => <option key={sm.id} value={sm.id}>{sm.nome}</option>)}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="label-compact">Descrição</label>
                    <input type="text" value={epDescricao} onChange={e => setEpDescricao(e.target.value)}
                      placeholder="O que este endpoint faz..." className="input-gcp" />
                  </div>
                  <div className="col-span-2">
                    <label className="label-compact">Ambiente</label>
                    <select value={epAmbiente} onChange={e => setEpAmbiente(e.target.value as 'Produção' | 'Homologação' | 'Ambos')} className="input-gcp">
                      <option value="Ambos">Ambos</option>
                      <option value="Produção">Produção</option>
                      <option value="Homologação">Homologação</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="label-compact">Status</label>
                    <select value={epStatus} onChange={e => setEpStatus(e.target.value as 'Ativo' | 'Depreciado' | 'Em desenvolvimento')} className="input-gcp">
                      <option value="Ativo">Ativo</option>
                      <option value="Em desenvolvimento">Em desenvolvimento</option>
                      <option value="Depreciado">Depreciado</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="label-compact">Autenticação</label>
                    <div className="flex gap-1.5">
                      <select value={epAuth ? 'sim' : 'nao'} onChange={e => setEpAuth(e.target.value === 'sim')} className="input-gcp flex-1">
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                      </select>
                      {epAuth && <input type="text" value={epAuthTipo} onChange={e => setEpAuthTipo(e.target.value)}
                        placeholder="Bearer JWT" className="input-gcp flex-1" />}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <label className="label-compact">Payload Exemplo (JSON)</label>
                    <textarea value={epPayload} onChange={e => setEpPayload(e.target.value)}
                      placeholder='{"key": "value"}' rows={3} className="input-gcp resize-none font-mono text-[11px]" />
                  </div>
                  <div className="col-span-3">
                    <label className="label-compact">Response Exemplo (JSON)</label>
                    <textarea value={epResponse} onChange={e => setEpResponse(e.target.value)}
                      placeholder='{"status": "ok"}' rows={3} className="input-gcp resize-none font-mono text-[11px]" />
                  </div>
                  <div className="col-span-3">
                    <label className="label-compact">Status Codes</label>
                    <textarea value={epStatusCodes} onChange={e => setEpStatusCodes(e.target.value)}
                      placeholder="200: Sucesso&#10;400: Erro de validação&#10;500: Erro interno" rows={2} className="input-gcp resize-none font-mono text-[11px]" />
                  </div>
                  <div className="col-span-3">
                    <label className="label-compact">cURL</label>
                    <textarea value={epCurl} onChange={e => setEpCurl(e.target.value)}
                      placeholder="curl -X GET ..." rows={2} className="input-gcp resize-none font-mono text-[11px]" />
                  </div>
                  <div className="col-span-6">
                    <label className="label-compact">Parâmetros (JSON)</label>
                    <textarea value={epParams} onChange={e => setEpParams(e.target.value)}
                      placeholder='[{"nome":"id","tipo":"string","obrigatorio":true,"descricao":"ID do recurso"}]'
                      rows={2} className="input-gcp resize-none font-mono text-[11px]" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1.5 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button type="button" onClick={() => { setShowEndpointForm(false); setEditingEndpoint(null); }} className="btn-secondary text-[11px]">Cancelar</button>
                  <button type="submit" className="btn-primary text-[11px]">Salvar Endpoint</button>
                </div>
              </form>
            )}

            {/* Accordion de Endpoints */}
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {endpoints.length === 0 ? (
                <p className="text-[12px] text-center py-6" style={{ color: 'var(--text-muted)' }}>Nenhum endpoint catalogado.</p>
              ) : endpoints.map(ep => {
                const isExpanded = !!expandedEndpoints[ep.id];
                const methodStyle = METHOD_STYLES[ep.metodo?.toUpperCase()] || METHOD_STYLES['OPTIONS'];
                const linkedSub = subModules.find(s => s.id === ep.submodule_id);
                const ambStyle = AMBIENTE_STYLES[ep.ambiente_disponivel] || AMBIENTE_STYLES['Ambos'];
                const epStatStyle = getStatusStyle(ep.status);

                return (
                  <div key={ep.id} style={{ borderColor: 'var(--border)' }}>
                    <div onClick={() => setExpandedEndpoints(prev => ({ ...prev, [ep.id]: !prev[ep.id] }))}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer group transition-colors"
                      style={{ backgroundColor: isExpanded ? 'var(--bg-selected)' : undefined }}
                      onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; }}
                      onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.backgroundColor = ''; }}>
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0"
                          style={{ backgroundColor: methodStyle.bg, color: methodStyle.color, border: `1px solid ${methodStyle.border}`, minWidth: 48, textAlign: 'center' }}>
                          {ep.metodo}
                        </span>
                        <span className="font-mono text-[12px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{ep.path}</span>
                        {linkedSub && <span className="text-[10px] px-1 py-0.5 rounded font-mono shrink-0" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }}>{linkedSub.nome}</span>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: epStatStyle.bg, color: epStatStyle.color }}>{ep.status}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); setEditingEndpoint(ep); resetEndpointForm(); setEpMetodo(ep.metodo); setEpPath(ep.path); setEpDescricao(ep.descricao || ''); setEpSubmoduleId(ep.submodule_id || ''); setEpPayload(ep.payload_exemplo || ''); setEpResponse(ep.exemplo_response || ''); setEpStatusCodes(ep.status_codes || ''); setEpAuth(ep.auth_exigida); setEpAuthTipo(ep.auth_tipo || ''); setEpAmbiente(ep.ambiente_disponivel); setEpStatus(ep.status); setEpCurl(ep.comando_curl || ''); setEpParams(ep.parametros || ''); setShowEndpointForm(true); }}
                            style={{ color: 'var(--blue-primary)' }}><Edit size={11} /></button>
                          <button onClick={(e) => { e.stopPropagation(); onDeleteEndpoint(ep.id); }}
                            style={{ color: 'var(--gcp-red)' }}><Trash2 size={11} /></button>
                        </div>
                        {isExpanded ? <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 py-3 border-t space-y-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-page)' }}>
                        {ep.descricao && (
                          <div className="text-[12px] pb-2 border-b" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
                            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Descrição: </span>{ep.descricao}
                          </div>
                        )}

                        {/* Metadados */}
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1"
                            style={{ backgroundColor: ambStyle.bg, color: ambStyle.color }}>
                            <Globe size={9} /> {ep.ambiente_disponivel}
                          </span>
                          {ep.auth_exigida && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1"
                              style={{ backgroundColor: '#F3E5FF', color: 'var(--gcp-purple)' }}>
                              <Shield size={9} /> {ep.auth_tipo || 'Autenticado'}
                            </span>
                          )}
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            style={{ backgroundColor: epStatStyle.bg, color: epStatStyle.color }}>
                            {ep.status}
                          </span>
                        </div>

                        {/* Parâmetros */}
                        {ep.parametros && (
                          <div>
                            <div className="text-[10px] font-semibold tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>PARÂMETROS</div>
                            <div className="rounded border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                              <table className="w-full text-left text-[11px]">
                                <thead>
                                  <tr style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                                    <th className="px-2 py-1 font-medium">Nome</th>
                                    <th className="px-2 py-1 font-medium">Tipo</th>
                                    <th className="px-2 py-1 font-medium">Obrigatório</th>
                                    <th className="px-2 py-1 font-medium">Descrição</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(() => { try { return JSON.parse(ep.parametros).map((p: any, i: number) => (
                                    <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                                      <td className="px-2 py-1 font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{p.nome}</td>
                                      <td className="px-2 py-1" style={{ color: 'var(--text-secondary)' }}>{p.tipo}</td>
                                      <td className="px-2 py-1">{p.obrigatorio ? <span style={{ color: 'var(--gcp-red)' }}>Sim</span> : <span style={{ color: 'var(--text-muted)' }}>Não</span>}</td>
                                      <td className="px-2 py-1" style={{ color: 'var(--text-secondary)' }}>{p.descricao || ''}</td>
                                    </tr>
                                  )); } catch { return <tr><td className="px-2 py-1" style={{ color: 'var(--text-muted)' }}>Erro ao carregar parâmetros</td></tr>; }})()}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Status Codes */}
                        {ep.status_codes && (
                          <div>
                            <div className="text-[10px] font-semibold tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>STATUS CODES</div>
                            <div className="text-[11px] font-mono whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{ep.status_codes}</div>
                          </div>
                        )}

                        {/* Payload */}
                        {ep.payload_exemplo && (
                          <div>
                            <div className="text-[10px] font-semibold tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>REQUEST</div>
                            <pre className="rounded border p-2.5 overflow-x-auto text-[11px] font-mono leading-relaxed"
                              style={{ backgroundColor: 'var(--bg-code)', borderColor: 'var(--border)', color: 'var(--blue-primary)' }}>{ep.payload_exemplo}</pre>
                          </div>
                        )}

                        {/* Response */}
                        {ep.exemplo_response && (
                          <div>
                            <div className="text-[10px] font-semibold tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>RESPONSE</div>
                            <pre className="rounded border p-2.5 overflow-x-auto text-[11px] font-mono leading-relaxed"
                              style={{ backgroundColor: 'var(--bg-code)', borderColor: 'var(--border)', color: 'var(--gcp-green)' }}>{ep.exemplo_response}</pre>
                          </div>
                        )}

                        {/* cURL */}
                        {ep.comando_curl && (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-[10px] font-semibold tracking-wider" style={{ color: 'var(--text-muted)' }}>CURL</div>
                              <button onClick={() => handleCopy(ep.comando_curl!, ep.id)}
                                className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border transition-all"
                                style={{ backgroundColor: copiedId === ep.id ? 'var(--gcp-green-bg)' : 'var(--bg-card)', borderColor: 'var(--border)', color: copiedId === ep.id ? 'var(--gcp-green)' : 'var(--blue-primary)' }}>
                                {copiedId === ep.id ? <><Check size={10} /> Copiado!</> : <><Copy size={10} /> Copiar</>}
                              </button>
                            </div>
                            <pre className="rounded border p-2.5 overflow-x-auto text-[11px] font-mono whitespace-pre-wrap"
                              style={{ backgroundColor: 'var(--bg-code)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>{ep.comando_curl}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Seção Confluence */}
      {activeSubSection === 'confluence' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>
              Referências ao Confluence ({confluenceReferences.length})
            </span>
            <button onClick={() => { setEditingConfluence(null); resetConfluenceForm(); setShowConfluenceForm(!showConfluenceForm); }}
              className="flex items-center gap-1 text-[11px] font-medium" style={{ color: 'var(--blue-primary)' }}>
              <Plus size={11} /> Nova Referência
            </button>
          </div>

          {showConfluenceForm && (
            <form onSubmit={handleSaveConfluenceSubmit} className="rounded-lg border p-3 space-y-2"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className="label-compact">Título *</label>
                  <input type="text" required value={crTitulo} onChange={e => setCrTitulo(e.target.value)}
                    placeholder="Nome do documento" className="input-gcp" />
                </div>
                <div className="col-span-2">
                  <label className="label-compact">URL *</label>
                  <input type="url" required value={crUrl} onChange={e => setCrUrl(e.target.value)}
                    placeholder="https://confluence.company.com/pages/..." className="input-gcp" />
                </div>
                <div>
                  <label className="label-compact">Categoria</label>
                  <select value={crCategoria} onChange={e => setCrCategoria(e.target.value as ConfluenceCategoria)} className="input-gcp">
                    {Object.entries(CONFLUENCE_CATEGORIA_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-compact">Última Atualização</label>
                  <input type="date" value={crData} onChange={e => setCrData(e.target.value)} className="input-gcp" />
                </div>
                <div className="col-span-2">
                  <label className="label-compact">Descrição</label>
                  <textarea value={crDescricao} onChange={e => setCrDescricao(e.target.value)}
                    placeholder="Breve descrição do conteúdo..." rows={2} className="input-gcp resize-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1.5 border-t" style={{ borderColor: 'var(--border)' }}>
                <button type="button" onClick={() => { setShowConfluenceForm(false); setEditingConfluence(null); }} className="btn-secondary text-[11px]">Cancelar</button>
                <button type="submit" className="btn-primary text-[11px]">Salvar</button>
              </div>
            </form>
          )}

          {confluenceReferences.length === 0 ? (
            <p className="text-[12px] text-center py-4" style={{ color: 'var(--text-muted)' }}>Nenhuma referência cadastrada.</p>
          ) : (
            <div className="space-y-1.5">
              {confluenceReferences.map(cr => (
                <div key={cr.id} className="group flex items-center justify-between rounded-lg border px-3 py-2.5"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <ExternalLink size={14} style={{ color: 'var(--blue-primary)' }} />
                    <div className="flex-1 min-w-0">
                      <a href={cr.url} target="_blank" rel="noreferrer"
                        className="text-[12px] font-medium hover:underline truncate block"
                        style={{ color: 'var(--blue-primary)' }}>
                        {cr.titulo}
                      </a>
                      {cr.descricao && (
                        <p className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>{cr.descricao}</p>
                      )}
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0"
                      style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
                      {CONFLUENCE_CATEGORIA_LABELS[cr.categoria]}
                    </span>
                    {cr.ultima_atualizacao && (
                      <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>
                        {cr.ultima_atualizacao}
                      </span>
                    )}
                  </div>
                  <button onClick={() => onDeleteConfluenceRef(cr.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 shrink-0"
                    style={{ color: 'var(--gcp-red)' }}>
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
