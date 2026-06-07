"use client";

import React, { useState } from 'react';
import { ApplicationDetails } from '@/ports/incoming/ManageApplicationsUseCase';
import { SubModule } from '@/domain/entities/SubModule';
import { Endpoint } from '@/domain/entities/Endpoint';
import { Collaborator } from '@/domain/entities/Collaborator';
import { Roadmap, Trimestre } from '@/domain/entities/Roadmap';
import { Stack } from '@/domain/entities/Stack';
import { Cliente } from '@/domain/entities/Cliente';
import { ClienteAtividade } from '@/domain/entities/ClienteAtividade';
import {
  BookOpen, Users, Settings, Calendar, Plus,
  ChevronDown, ChevronRight, Copy, Check, ExternalLink,
  Trash2, Edit, BarChart3, Download, Cpu, UserCheck
} from 'lucide-react';
import CollaboratorSection from './CollaboratorSection';
import MonitoringForm from './MonitoringForm';
import SubModuleForm from './SubModuleForm';
import EndpointForm from './EndpointForm';
import RoadmapForm from './RoadmapForm';
import StackForm from './StackForm';
import ClienteSection from './ClienteSection';

interface AppDetailsProps {
  details: ApplicationDetails;
  allCollaborators: Collaborator[];
  onRefresh: () => void;
  onSaveSubModule: (data: Omit<SubModule, 'id'> & { id?: string }) => Promise<void>;
  onDeleteSubModule: (id: string) => Promise<void>;
  onSaveEndpoint: (data: Omit<Endpoint, 'id'> & { id?: string }) => Promise<void>;
  onDeleteEndpoint: (id: string) => Promise<void>;
  onAssociateCollaborator: (collId: string) => Promise<void>;
  onDissociateCollaborator: (collId: string) => Promise<void>;
  onCreateAndAssociateCollaborator: (data: Omit<Collaborator, 'id'>) => Promise<void>;
  onDeleteCollaboratorGlobal: (collId: string) => Promise<void>;
  onSaveMonitoring: (data: any) => Promise<void>;
  onSaveRoadmap: (data: Omit<Roadmap, 'id'> & { id?: string }) => Promise<void>;
  onDeleteRoadmap: (id: string) => Promise<void>;
  onUpdateAppBasic: (data: any) => Promise<void>;
  onSaveStack: (data: Omit<Stack, 'id'> & { id?: string }) => Promise<void>;
  onDeleteStack: (id: string) => Promise<void>;
  onSaveCliente: (data: Omit<Cliente, 'id'> & { id?: string }) => Promise<void>;
  onDeleteCliente: (id: string) => Promise<void>;
  onSaveClienteAtividade: (data: Omit<ClienteAtividade, 'id'> & { id?: string }) => Promise<void>;
  onDeleteClienteAtividade: (id: string) => Promise<void>;
  onLoadClienteAtividades: (clienteId: string) => Promise<ClienteAtividade[]>;
}

type TabType = 'docs' | 'team' | 'env' | 'stack' | 'clientes' | 'roadmap';

const METHOD_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  GET:     { bg: 'var(--gcp-green-bg)',  color: 'var(--gcp-green)',  border: 'var(--gcp-green)' },
  POST:    { bg: 'var(--blue-light)',    color: 'var(--blue-primary)', border: 'var(--blue-primary)' },
  PUT:     { bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)',  border: 'var(--gcp-amber)' },
  DELETE:  { bg: 'var(--gcp-red-bg)',   color: 'var(--gcp-red)',    border: 'var(--gcp-red)' },
  PATCH:   { bg: '#F3E5FF',             color: 'var(--gcp-purple)', border: 'var(--gcp-purple)' },
  OPTIONS: { bg: 'var(--bg-hover)',     color: 'var(--text-muted)', border: 'var(--border)' },
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  'Done':        { bg: 'var(--gcp-green-bg)',  color: 'var(--gcp-green)' },
  'In Progress': { bg: 'var(--blue-light)',    color: 'var(--blue-primary)' },
  'Backlog':     { bg: 'var(--bg-hover)',      color: 'var(--text-secondary)' },
  'Homologação': { bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' },
  'Bloqueado':   { bg: 'var(--gcp-red-bg)',   color: 'var(--gcp-red)' },
};

const STATUS_LABELS: Record<string, string> = {
  'Done': 'Concluído',
  'In Progress': 'Em Andamento',
  'Backlog': 'Backlog',
  'Homologação': 'Homologação',
  'Bloqueado': 'Bloqueado',
};

export default function AppDetails({
  details,
  allCollaborators,
  onRefresh,
  onSaveSubModule,
  onDeleteSubModule,
  onSaveEndpoint,
  onDeleteEndpoint,
  onAssociateCollaborator,
  onDissociateCollaborator,
  onCreateAndAssociateCollaborator,
  onDeleteCollaboratorGlobal,
  onSaveMonitoring,
  onSaveRoadmap,
  onDeleteRoadmap,
  onUpdateAppBasic,
  onSaveStack,
  onDeleteStack,
  onSaveCliente,
  onDeleteCliente,
  onSaveClienteAtividade,
  onDeleteClienteAtividade,
  onLoadClienteAtividades,
}: AppDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('docs');
  const [expandedEndpoints, setExpandedEndpoints] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [showSubModuleForm, setShowSubModuleForm] = useState(false);
  const [showEndpointForm, setShowEndpointForm] = useState(false);
  const [showRoadmapForm, setShowRoadmapForm] = useState(false);
  const [editingSubModule, setEditingSubModule] = useState<SubModule | null>(null);
  const [editingEndpoint, setEditingEndpoint] = useState<Endpoint | null>(null);
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null);
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [clienteAtividades, setClienteAtividades] = useState<Record<string, ClienteAtividade[]>>({});

  const [basicNome, setBasicNome] = useState(details.application.nome);
  const [basicProposito, setBasicProposito] = useState(details.application.proposito || '');
  const [basicEscopo, setBasicEscopo] = useState(details.application.escopo || '');
  const [basicHml, setBasicHml] = useState(details.application.ambiente_hml || '');
  const [basicPrd, setBasicPrd] = useState(details.application.ambiente_prd || '');
  const [basicConfluence, setBasicConfluence] = useState(details.application.link_confluence || '');

  React.useEffect(() => {
    setBasicNome(details.application.nome);
    setBasicProposito(details.application.proposito || '');
    setBasicEscopo(details.application.escopo || '');
    setBasicHml(details.application.ambiente_hml || '');
    setBasicPrd(details.application.ambiente_prd || '');
    setBasicConfluence(details.application.link_confluence || '');
  }, [details.application]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateAppBasic({
      nome: basicNome, proposito: basicProposito || null, escopo: basicEscopo || null,
      ambiente_hml: basicHml || null, ambiente_prd: basicPrd || null, link_confluence: basicConfluence || null,
    });
    setIsEditingBasic(false);
  };

  const handleLoadClienteAtividades = async (clienteId: string) => {
    const atividades = await onLoadClienteAtividades(clienteId);
    setClienteAtividades(prev => ({ ...prev, [clienteId]: atividades }));
  };

  const handleSaveClienteAtividade = async (clienteId: string, data: Omit<ClienteAtividade, 'id'> & { id?: string }) => {
    await onSaveClienteAtividade(data);
    await handleLoadClienteAtividades(clienteId);
  };

  const handleDeleteClienteAtividade = async (id: string) => {
    if (!confirm("Excluir atividade?")) return;
    await onDeleteClienteAtividade(id);
    setClienteAtividades(prev => {
      const updated = { ...prev };
      for (const key of Object.keys(updated)) {
        updated[key] = updated[key].filter(a => a.id !== id);
      }
      return updated;
    });
  };

  const handleExportRoadmap = () => {
    const rows = [['Atividade', 'Detalhamento', 'Data Prevista Finalização', 'Trimestre', 'Ano', 'Status']];
    details.roadmap.forEach(r => {
      rows.push([r.atividade, r.detalhamento || '', r.data_prevista_finalizacao || '', r.trimestre, String(r.ano), STATUS_LABELS[r.status] || r.status]);
    });
    const csv = rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roadmap-${details.application.nome.replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const { application, subModules, endpoints, collaborators, monitoring, roadmap, stacks, clientes } = details;

  const roadmapByQuarter: Record<Trimestre, Roadmap[]> = { Q1: [], Q2: [], Q3: [], Q4: [] };
  roadmap.forEach(item => { if (roadmapByQuarter[item.trimestre]) roadmapByQuarter[item.trimestre].push(item); });

  const TABS: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'docs', label: 'Documentação / Endpoints', icon: <BookOpen size={13} /> },
    { id: 'team', label: 'Equipe', icon: <Users size={13} />, badge: collaborators.length },
    { id: 'env',  label: 'Monitoria & Ambientes',  icon: <Settings size={13} /> },
    { id: 'stack', label: 'Stack', icon: <Cpu size={13} />, badge: stacks.length },
    { id: 'clientes', label: 'Clientes', icon: <UserCheck size={13} />, badge: clientes.length },
    { id: 'roadmap', label: 'Roadmap', icon: <Calendar size={13} />, badge: roadmap.length },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: "var(--bg-page)" }}>

      {/* Cabeçalho da Aplicação */}
      <div className="px-4 py-3 border-b shrink-0"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
        {!isEditingBasic ? (
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {application.nome}
                </h2>
                <div className="flex items-center gap-2 text-[11px]">
                  {application.ambiente_prd && (
                    <a href={application.ambiente_prd} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: "var(--gcp-green-bg)", color: "var(--gcp-green)" }}>
                      PRD <ExternalLink size={9} />
                    </a>
                  )}
                  {application.ambiente_hml && (
                    <a href={application.ambiente_hml} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: "var(--gcp-amber-bg)", color: "var(--gcp-amber)" }}>
                      HML <ExternalLink size={9} />
                    </a>
                  )}
                  {monitoring?.grafana_url && (
                    <a href={monitoring.grafana_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: "var(--blue-light)", color: "var(--blue-primary)" }}>
                      Grafana <ExternalLink size={9} />
                    </a>
                  )}
                  {monitoring?.datadog_url && (
                    <a href={monitoring.datadog_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: "var(--blue-light)", color: "var(--gcp-purple, #6200EE)" }}>
                      Datadog <ExternalLink size={9} />
                    </a>
                  )}
                  {application.link_confluence && (
                    <a href={application.link_confluence} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-secondary)" }}>
                      <BookOpen size={9} /> Confluence
                    </a>
                  )}
                </div>
              </div>
              <button onClick={() => setIsEditingBasic(true)} className="btn-secondary text-[11px]">
                Editar
              </button>
            </div>
            {application.proposito && (
              <p className="text-[12px] mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {application.proposito}
              </p>
            )}
            {application.escopo && (
              <p className="text-[11px] mt-0.5 font-mono" style={{ color: "var(--text-muted)" }}>
                {application.escopo}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSaveBasic} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div><label className="label-compact">Nome</label><input type="text" required value={basicNome} onChange={e => setBasicNome(e.target.value)} className="input-gcp" /></div>
              <div><label className="label-compact">Confluence</label><input type="url" value={basicConfluence} onChange={e => setBasicConfluence(e.target.value)} className="input-gcp" /></div>
              <div><label className="label-compact">HML URL</label><input type="url" value={basicHml} onChange={e => setBasicHml(e.target.value)} className="input-gcp" /></div>
              <div><label className="label-compact">PRD URL</label><input type="url" value={basicPrd} onChange={e => setBasicPrd(e.target.value)} className="input-gcp" /></div>
              <div className="col-span-2"><label className="label-compact">Propósito</label><textarea value={basicProposito} onChange={e => setBasicProposito(e.target.value)} rows={2} className="input-gcp resize-none" /></div>
              <div className="col-span-2"><label className="label-compact">Escopo</label><textarea value={basicEscopo} onChange={e => setBasicEscopo(e.target.value)} rows={2} className="input-gcp resize-none" /></div>
            </div>
            <div className="flex justify-end gap-2 pt-1 border-t" style={{ borderColor: "var(--border)" }}>
              <button type="button" onClick={() => setIsEditingBasic(false)} className="btn-secondary text-[11px]">Cancelar</button>
              <button type="submit" className="btn-primary text-[11px]">Salvar</button>
            </div>
          </form>
        )}
      </div>

      {/* Abas */}
      <div className="flex border-b shrink-0 overflow-x-auto"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-[12px] font-medium border-b-2 transition-all duration-100 whitespace-nowrap"
            style={{
              borderBottomColor: activeTab === tab.id ? "var(--blue-primary)" : "transparent",
              color: activeTab === tab.id ? "var(--blue-primary)" : "var(--text-secondary)",
            }}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="px-1 py-0.5 rounded text-[10px] leading-none font-mono"
                style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-muted)" }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Conteúdo das Abas */}
      <div className="flex-1 overflow-y-auto p-3" style={{ backgroundColor: "var(--bg-page)" }}>

        {/* TAB: Documentação / Endpoints */}
        {activeTab === 'docs' && (
          <div className="space-y-3">

            {/* Submódulos */}
            <div className="rounded-lg border overflow-hidden"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <div className="flex items-center justify-between px-3 py-2 border-b"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-hover)" }}>
                <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
                  Submódulos ({subModules.length})
                </span>
                <button
                  onClick={() => { setEditingSubModule(null); setShowSubModuleForm(!showSubModuleForm); }}
                  className="flex items-center gap-1 text-[11px] font-medium"
                  style={{ color: "var(--blue-primary)" }}>
                  <Plus size={11} /> Novo Submódulo
                </button>
              </div>

              {showSubModuleForm && (
                <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
                  <SubModuleForm
                    applicationId={application.id}
                    initialData={editingSubModule}
                    onSubmit={async (data) => { await onSaveSubModule(data); setShowSubModuleForm(false); setEditingSubModule(null); }}
                    onCancel={() => { setShowSubModuleForm(false); setEditingSubModule(null); }}
                  />
                </div>
              )}

              <div className="p-3">
                {subModules.length === 0 ? (
                  <p className="text-[12px] text-center py-4" style={{ color: "var(--text-muted)" }}>
                    Nenhum submódulo cadastrado.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {subModules.map(sm => (
                      <div key={sm.id} className="group rounded border p-2.5 flex flex-col justify-between"
                        style={{ backgroundColor: "var(--bg-page)", borderColor: "var(--border)" }}>
                        <div>
                          <div className="font-medium text-[12px]" style={{ color: "var(--text-primary)" }}>{sm.nome}</div>
                          {sm.proposito && (
                            <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{sm.proposito}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingSubModule(sm); setShowSubModuleForm(true); }}
                            style={{ color: "var(--blue-primary)" }}><Edit size={11} /></button>
                          <button onClick={() => onDeleteSubModule(sm.id)}
                            style={{ color: "var(--gcp-red)" }}><Trash2 size={11} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Endpoints */}
            <div className="rounded-lg border overflow-hidden"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <div className="flex items-center justify-between px-3 py-2 border-b"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-hover)" }}>
                <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
                  Endpoints da API ({endpoints.length})
                </span>
                <button
                  onClick={() => { setEditingEndpoint(null); setShowEndpointForm(!showEndpointForm); }}
                  className="flex items-center gap-1 text-[11px] font-medium"
                  style={{ color: "var(--blue-primary)" }}>
                  <Plus size={11} /> Novo Endpoint
                </button>
              </div>

              {showEndpointForm && (
                <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
                  <EndpointForm
                    applicationId={application.id}
                    subModules={subModules}
                    initialData={editingEndpoint}
                    onSubmit={async (data) => { await onSaveEndpoint(data); setShowEndpointForm(false); setEditingEndpoint(null); }}
                    onCancel={() => { setShowEndpointForm(false); setEditingEndpoint(null); }}
                  />
                </div>
              )}

              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {endpoints.length === 0 ? (
                  <p className="text-[12px] text-center py-6" style={{ color: "var(--text-muted)" }}>
                    Nenhum endpoint catalogado.
                  </p>
                ) : endpoints.map(ep => {
                  const isExpanded = !!expandedEndpoints[ep.id];
                  const linkedSub = subModules.find(s => s.id === ep.submodule_id);
                  const methodStyle = METHOD_STYLES[ep.metodo?.toUpperCase()] || METHOD_STYLES['OPTIONS'];

                  return (
                    <div key={ep.id} style={{ borderColor: "var(--border)" }}>
                      <div
                        onClick={() => setExpandedEndpoints(prev => ({ ...prev, [ep.id]: !prev[ep.id] }))}
                        className="flex items-center justify-between px-3 py-2 cursor-pointer group transition-colors duration-100"
                        style={{ backgroundColor: isExpanded ? "var(--bg-selected)" : undefined }}
                        onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
                        onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.backgroundColor = ""; }}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0"
                            style={{
                              backgroundColor: methodStyle.bg,
                              color: methodStyle.color,
                              border: `1px solid ${methodStyle.border}`,
                              minWidth: 48, textAlign: 'center'
                            }}>
                            {ep.metodo}
                          </span>
                          <span className="font-mono text-[12px] font-medium truncate"
                            style={{ color: "var(--text-primary)" }}>
                            {ep.path}
                          </span>
                          {linkedSub && (
                            <span className="text-[10px] px-1 py-0.5 rounded font-mono shrink-0"
                              style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-muted)" }}>
                              {linkedSub.nome}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {ep.descricao && (
                            <span className="hidden md:block text-[11px] truncate max-w-[200px]"
                              style={{ color: "var(--text-secondary)" }}>
                              {ep.descricao}
                            </span>
                          )}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); setEditingEndpoint(ep); setShowEndpointForm(true); }}
                              style={{ color: "var(--blue-primary)" }}>
                              <Edit size={11} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onDeleteEndpoint(ep.id); }}
                              style={{ color: "var(--gcp-red)" }}>
                              <Trash2 size={11} />
                            </button>
                          </div>
                          {isExpanded ? <ChevronDown size={13} style={{ color: "var(--text-muted)" }} />
                            : <ChevronRight size={13} style={{ color: "var(--text-muted)" }} />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 py-3 border-t space-y-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-page)" }}>
                          {ep.descricao && (
                            <div className="text-[12px] pb-2 border-b" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>
                              <span className="font-medium" style={{ color: "var(--text-primary)" }}>Descrição: </span>{ep.descricao}
                            </div>
                          )}

                          {ep.payload_exemplo && (
                            <div>
                              <div className="text-[10px] font-semibold tracking-wider mb-1.5"
                                style={{ color: "var(--text-muted)" }}>
                                EXEMPLO DE PAYLOAD
                              </div>
                              <pre className="rounded border p-2.5 overflow-x-auto text-[11px] font-mono leading-relaxed"
                                style={{ backgroundColor: "var(--bg-code)", borderColor: "var(--border)", color: "var(--blue-primary)" }}>
                                {ep.payload_exemplo}
                              </pre>
                            </div>
                          )}

                          {ep.comando_curl && (
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="text-[10px] font-semibold tracking-wider"
                                  style={{ color: "var(--text-muted)" }}>
                                  COMANDO CURL
                                </div>
                                <button
                                  onClick={() => handleCopy(ep.comando_curl!, ep.id)}
                                  className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border transition-all"
                                  style={{
                                    backgroundColor: copiedId === ep.id ? "var(--gcp-green-bg)" : "var(--bg-card)",
                                    borderColor: "var(--border)",
                                    color: copiedId === ep.id ? "var(--gcp-green)" : "var(--blue-primary)"
                                  }}>
                                  {copiedId === ep.id ? <><Check size={10} /> Copiado!</> : <><Copy size={10} /> Copiar</>}
                                </button>
                              </div>
                              <pre className="rounded border p-2.5 overflow-x-auto text-[11px] font-mono leading-normal whitespace-pre-wrap"
                                style={{ backgroundColor: "var(--bg-code)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
                                {ep.comando_curl}
                              </pre>
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

        {/* TAB: Equipe */}
        {activeTab === 'team' && (
          <CollaboratorSection
            applicationId={application.id}
            currentCollaborators={collaborators}
            allCollaborators={allCollaborators}
            onAssociate={onAssociateCollaborator}
            onDissociate={onDissociateCollaborator}
            onCreateAndAssociate={onCreateAndAssociateCollaborator}
            onDeleteGlobal={onDeleteCollaboratorGlobal}
          />
        )}

        {/* TAB: Monitoria & Ambientes */}
        {activeTab === 'env' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* HML */}
              <div className="rounded-lg border p-3"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", borderLeftWidth: 4, borderLeftColor: "var(--gcp-amber)", boxShadow: "var(--shadow-sm)" }}>
                <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: "var(--gcp-amber)" }}>
                  AMBIENTE DE HOMOLOGAÇÃO (HML)
                </div>
                <p className="font-mono text-[11px] mb-2" style={{ color: "var(--text-secondary)" }}>
                  {application.ambiente_hml || <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Não configurado</span>}
                </p>
                {application.ambiente_hml && (
                  <a href={application.ambiente_hml} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded"
                    style={{ backgroundColor: "var(--gcp-amber-bg)", color: "var(--gcp-amber)" }}>
                    Acessar HML <ExternalLink size={10} />
                  </a>
                )}
              </div>

              {/* PRD */}
              <div className="rounded-lg border p-3"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", borderLeftWidth: 4, borderLeftColor: "var(--gcp-green)", boxShadow: "var(--shadow-sm)" }}>
                <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: "var(--gcp-green)" }}>
                  AMBIENTE DE PRODUÇÃO (PRD)
                </div>
                <p className="font-mono text-[11px] mb-2" style={{ color: "var(--text-secondary)" }}>
                  {application.ambiente_prd || <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Não configurado</span>}
                </p>
                {application.ambiente_prd && (
                  <a href={application.ambiente_prd} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded"
                    style={{ backgroundColor: "var(--gcp-green-bg)", color: "var(--gcp-green)" }}>
                    Acessar Produção <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>

            {/* Monitoria */}
            <div className="rounded-lg border overflow-hidden"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <div className="flex items-center gap-2 px-3 py-2 border-b"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-hover)" }}>
                <BarChart3 size={13} style={{ color: "var(--blue-primary)" }} />
                <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
                  Monitoramento (Grafana / Datadog)
                </span>
              </div>
              <div className="p-3">
                <MonitoringForm applicationId={application.id} initialData={monitoring} onSubmit={onSaveMonitoring} />
              </div>
            </div>
          </div>
        )}

        {/* TAB: Stack */}
        {activeTab === 'stack' && (
          <StackForm
            applicationId={application.id}
            stacks={stacks}
            onSave={onSaveStack}
            onDelete={onDeleteStack}
          />
        )}

        {/* TAB: Clientes */}
        {activeTab === 'clientes' && (
          <ClienteSection
            applicationId={application.id}
            clientes={clientes}
            endpoints={endpoints}
            onSaveCliente={onSaveCliente}
            onDeleteCliente={onDeleteCliente}
            onSaveAtividade={handleSaveClienteAtividade}
            onDeleteAtividade={handleDeleteClienteAtividade}
            atividadesMap={clienteAtividades}
            onLoadAtividades={handleLoadClienteAtividades}
          />
        )}

        {/* TAB: Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>Roadmap</h4>
                <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Planejamento estratégico de entregas por trimestre</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportRoadmap}
                  className="btn-secondary flex items-center gap-1.5 text-[11px]">
                  <Download size={11} /> Exportar CSV
                </button>
                <button
                  onClick={() => { setEditingRoadmap(null); setShowRoadmapForm(!showRoadmapForm); }}
                  className="btn-secondary flex items-center gap-1.5 text-[11px]">
                  <Plus size={11} /> Nova Atividade
                </button>
              </div>
            </div>

            {showRoadmapForm && (
              <RoadmapForm
                applicationId={application.id}
                initialData={editingRoadmap}
                onSubmit={async (data) => { await onSaveRoadmap(data); setShowRoadmapForm(false); setEditingRoadmap(null); }}
                onCancel={() => { setShowRoadmapForm(false); setEditingRoadmap(null); }}
              />
            )}

            {/* Grid por Trimestre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(['Q1', 'Q2', 'Q3', 'Q4'] as Trimestre[]).map(quarter => {
                const items = roadmapByQuarter[quarter];
                const labels: Record<Trimestre, string> = { Q1: 'Jan–Mar', Q2: 'Abr–Jun', Q3: 'Jul–Set', Q4: 'Out–Dez' };
                return (
                  <div key={quarter} className="rounded-lg border overflow-hidden flex flex-col"
                    style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}>
                    <div className="flex items-center justify-between px-2.5 py-2 border-b"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-hover)" }}>
                      <div>
                        <span className="font-bold text-[12px]" style={{ color: "var(--text-primary)" }}>{quarter}</span>
                        <span className="text-[10px] ml-1.5" style={{ color: "var(--text-muted)" }}>{labels[quarter]}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "var(--bg-page)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                        {items.length}
                      </span>
                    </div>

                    <div className="flex-1 p-2 space-y-1.5 overflow-y-auto" style={{ maxHeight: 420 }}>
                      {items.length === 0 ? (
                        <div className="text-center py-6 text-[11px] rounded border border-dashed"
                          style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}>
                          Nenhuma atividade
                        </div>
                      ) : items.map(item => {
                        const ss = STATUS_STYLES[item.status] || STATUS_STYLES['Backlog'];
                        return (
                          <div key={item.id} className="group rounded border p-2 flex flex-col gap-1.5 transition-colors"
                            style={{ backgroundColor: "var(--bg-page)", borderColor: "var(--border)" }}>
                            <p className="text-[12px] font-medium leading-snug" style={{ color: "var(--text-primary)" }}>
                              {item.atividade}
                            </p>
                            {item.detalhamento && (
                              <p className="text-[11px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                                {item.detalhamento}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: ss.bg, color: ss.color }}>
                                {STATUS_LABELS[item.status] || item.status}
                              </span>
                              {item.data_prevista_finalizacao && (
                                <span className="text-[9px] font-mono px-1 py-0.5 rounded"
                                  style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-muted)" }}>
                                  {item.data_prevista_finalizacao}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingRoadmap(item); setShowRoadmapForm(true); }}
                                style={{ color: "var(--blue-primary)" }}><Edit size={10} /></button>
                              <button onClick={() => onDeleteRoadmap(item.id)}
                                style={{ color: "var(--gcp-red)" }}><Trash2 size={10} /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
