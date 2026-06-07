"use client";

import React, { useState } from 'react';
import { ApplicationDetails } from '@/adapters/in/usecase';
import { SubModule } from '@/domain/entities/SubModule';
import { Endpoint } from '@/domain/entities/Endpoint';
import { Collaborator } from '@/domain/entities/Collaborator';
import { Roadmap } from '@/domain/entities/Roadmap';
import { Stack } from '@/domain/entities/Stack';
import { Cliente } from '@/domain/entities/Cliente';
import { ClienteAtividade } from '@/domain/entities/ClienteAtividade';
import { Ocorrencia } from '@/domain/entities/Ocorrencia';
import { ConfluenceReference } from '@/domain/entities/ConfluenceReference';
import {
  LayoutDashboard, Calendar, Users, UserCheck, Cpu,
  BookOpen, Activity, ExternalLink, BookOpen as BookOpenIcon
} from 'lucide-react';
import DashboardSection from './DashboardSection';
import RoadmapSection from './RoadmapSection';
import CollaboratorSection from './CollaboratorSection';
import ClienteSection from './ClienteSection';
import StackForm from './StackForm';
import DocumentationSection from './DocumentationSection';
import MonitoringSection from './MonitoringSection';

type TabType = 'dashboard' | 'roadmap' | 'team' | 'clientes' | 'stack' | 'docs' | 'monitoring';

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
  onSaveOcorrencia: (data: Omit<Ocorrencia, 'id'> & { id?: string }) => Promise<void>;
  onDeleteOcorrencia: (id: string) => Promise<void>;
  onSaveConfluenceRef: (data: Omit<ConfluenceReference, 'id'> & { id?: string }) => Promise<void>;
  onDeleteConfluenceRef: (id: string) => Promise<void>;
}

export default function AppDetails({
  details, allCollaborators, onRefresh,
  onSaveSubModule, onDeleteSubModule, onSaveEndpoint, onDeleteEndpoint,
  onAssociateCollaborator, onDissociateCollaborator, onCreateAndAssociateCollaborator,
  onDeleteCollaboratorGlobal, onSaveMonitoring, onSaveRoadmap, onDeleteRoadmap,
  onUpdateAppBasic, onSaveStack, onDeleteStack, onSaveCliente, onDeleteCliente,
  onSaveClienteAtividade, onDeleteClienteAtividade, onLoadClienteAtividades,
  onSaveOcorrencia, onDeleteOcorrencia, onSaveConfluenceRef, onDeleteConfluenceRef,
}: AppDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
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

  const { application, subModules, endpoints, collaborators, monitoring, roadmap, stacks, clientes, ocorrencias, confluenceReferences } = details;

  const TABS: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard',  label: 'Visão Geral',  icon: <LayoutDashboard size={13} /> },
    { id: 'roadmap',    label: 'Roadmap',      icon: <Calendar size={13} />, badge: roadmap.length },
    { id: 'team',       label: 'Equipe',       icon: <Users size={13} />, badge: collaborators.length },
    { id: 'clientes',   label: 'Clientes',     icon: <UserCheck size={13} />, badge: clientes.length },
    { id: 'stack',      label: 'Stack',        icon: <Cpu size={13} />, badge: stacks.length },
    { id: 'docs',       label: 'Documentação', icon: <BookOpenIcon size={13} />, badge: endpoints.length + confluenceReferences.length },
    { id: 'monitoring', label: 'Monitoramento',icon: <Activity size={13} />, badge: ocorrencias.length },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Cabeçalho da Aplicação */}
      <div className="px-4 py-3 border-b shrink-0"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        {!isEditingBasic ? (
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <h2 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {application.nome}
                </h2>
                <div className="flex items-center gap-2 text-[11px] shrink-0">
                  {application.ambiente_prd && (
                    <a href={application.ambiente_prd} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: 'var(--gcp-green-bg)', color: 'var(--gcp-green)' }}>
                      PRD <ExternalLink size={9} />
                    </a>
                  )}
                  {application.ambiente_hml && (
                    <a href={application.ambiente_hml} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' }}>
                      HML <ExternalLink size={9} />
                    </a>
                  )}
                  {monitoring?.grafana_url && (
                    <a href={monitoring.grafana_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: 'var(--blue-light)', color: 'var(--blue-primary)' }}>
                      Grafana <ExternalLink size={9} />
                    </a>
                  )}
                  {application.link_confluence && (
                    <a href={application.link_confluence} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
                      <BookOpen size={9} /> Confluence
                    </a>
                  )}
                </div>
              </div>
              <button onClick={() => setIsEditingBasic(true)} className="btn-secondary text-[11px] shrink-0 ml-2">
                Editar
              </button>
            </div>
            {application.proposito && (
              <p className="text-[12px] mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {application.proposito}
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
            <div className="flex justify-end gap-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
              <button type="button" onClick={() => setIsEditingBasic(false)} className="btn-secondary text-[11px]">Cancelar</button>
              <button type="submit" className="btn-primary text-[11px]">Salvar</button>
            </div>
          </form>
        )}
      </div>

      {/* Abas */}
      <div className="flex border-b shrink-0 overflow-x-auto"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-[12px] font-medium border-b-2 transition-all duration-100 whitespace-nowrap"
            style={{
              borderBottomColor: activeTab === tab.id ? 'var(--blue-primary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--blue-primary)' : 'var(--text-secondary)',
            }}>
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="px-1 py-0.5 rounded text-[10px] leading-none font-mono"
                style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-3" style={{ backgroundColor: 'var(--bg-page)' }}>
        {activeTab === 'dashboard' && (
          <DashboardSection details={details} />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapSection
            applicationId={application.id}
            roadmap={roadmap}
            onSave={onSaveRoadmap}
            onDelete={onDeleteRoadmap}
          />
        )}

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

        {activeTab === 'stack' && (
          <StackForm
            applicationId={application.id}
            stacks={stacks}
            onSave={onSaveStack}
            onDelete={onDeleteStack}
          />
        )}

        {activeTab === 'docs' && (
          <DocumentationSection
            applicationId={application.id}
            subModules={subModules}
            endpoints={endpoints}
            confluenceReferences={confluenceReferences}
            onSaveSubModule={onSaveSubModule}
            onDeleteSubModule={onDeleteSubModule}
            onSaveEndpoint={onSaveEndpoint}
            onDeleteEndpoint={onDeleteEndpoint}
            onSaveConfluenceRef={onSaveConfluenceRef}
            onDeleteConfluenceRef={onDeleteConfluenceRef}
          />
        )}

        {activeTab === 'monitoring' && (
          <MonitoringSection
            applicationId={application.id}
            monitoring={monitoring}
            ocorrencias={ocorrencias}
            collaborators={allCollaborators}
            onSaveMonitoring={onSaveMonitoring}
            onSaveOcorrencia={onSaveOcorrencia}
            onDeleteOcorrencia={onDeleteOcorrencia}
          />
        )}
      </div>
    </div>
  );
}
