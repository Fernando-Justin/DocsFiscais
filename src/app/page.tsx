"use client";

import React, { useState, useEffect } from 'react';
import { almService, ApplicationListItem, ApplicationDetails } from '@/adapters/in/usecase';
import { Collaborator } from '@/domain/entities/Collaborator';
import { Application } from '@/domain/entities/Application';
import { SubModule } from '@/domain/entities/SubModule';
import { Endpoint } from '@/domain/entities/Endpoint';
import { Roadmap } from '@/domain/entities/Roadmap';
import { Stack } from '@/domain/entities/Stack';
import { Cliente } from '@/domain/entities/Cliente';
import { ClienteAtividade } from '@/domain/entities/ClienteAtividade';
import { Ocorrencia } from '@/domain/entities/Ocorrencia';
import { ConfluenceReference } from '@/domain/entities/ConfluenceReference';
import { isSupabaseConfigured } from '@/adapters/out/supabase/client';
import AppForm from './components/AppForm';
import AppDetails from './components/AppDetails';
import ThemeSwitcher from './components/ThemeSwitcher';
import Link from 'next/link';
import {
  Search, Plus, Layers, Database, Users, Trash2,
  ChevronRight, CheckCircle2, AlertTriangle, LayoutGrid,
  FileText, Rocket, Info
} from 'lucide-react';

export default function Home() {
  const [apps, setApps] = useState<ApplicationListItem[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<ApplicationDetails | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateApp, setShowCreateApp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appList, collabList] = await Promise.all([
        almService.getApplicationsList(),
        almService.getCollaborators()
      ]);
      setApps(appList);
      setCollaborators(collabList);
      if (selectedAppId) await loadDetails(selectedAppId);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadDetails = async (id: string) => {
    try {
      setDetailsLoading(true);
      const details = await almService.getApplicationDetails(id);
      setSelectedDetails(details);
    } catch (err) {
      console.error("Erro ao carregar detalhes:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [selectedAppId]);

  const handleSelectApp = (id: string) => {
    setShowCreateApp(false);
    setSelectedAppId(id);
  };

  const handleCreateAppSubmit = async (data: Omit<Application, 'id'>) => {
    try {
      const created = await almService.createApplication(data);
      await loadData();
      setShowCreateApp(false);
      setSelectedAppId(created.id);
    } catch (err) { console.error(err); }
  };

  const handleUpdateAppBasic = async (data: Partial<Application>) => {
    if (!selectedAppId) return;
    try {
      await almService.updateApplication(selectedAppId, data);
      await loadData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteApp = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Excluir esta aplicação e todas as suas dependências?")) return;
    try {
      await almService.deleteApplication(id);
      if (selectedAppId === id) { setSelectedAppId(null); setSelectedDetails(null); }
      await loadData();
    } catch (err) { console.error(err); }
  };

  const handleSaveSubModule = async (data: Omit<SubModule, 'id'> & { id?: string }) => {
    if (!selectedAppId) return;
    await almService.saveSubModule(data);
    await loadDetails(selectedAppId);
  };

  const handleDeleteSubModule = async (id: string) => {
    if (!selectedAppId || !confirm("Excluir submódulo?")) return;
    await almService.deleteSubModule(id);
    await loadDetails(selectedAppId);
  };

  const handleSaveEndpoint = async (data: Omit<Endpoint, 'id'> & { id?: string }) => {
    if (!selectedAppId) return;
    await almService.saveEndpoint(data);
    await loadDetails(selectedAppId);
  };

  const handleDeleteEndpoint = async (id: string) => {
    if (!selectedAppId || !confirm("Excluir endpoint?")) return;
    await almService.deleteEndpoint(id);
    await loadDetails(selectedAppId);
  };

  const handleAssociateCollaborator = async (collId: string) => {
    if (!selectedAppId) return;
    await almService.associateCollaborator(selectedAppId, collId);
    await loadData();
  };

  const handleDissociateCollaborator = async (collId: string) => {
    if (!selectedAppId || !confirm("Remover colaborador desta aplicação?")) return;
    await almService.dissociateCollaborator(selectedAppId, collId);
    await loadData();
  };

  const handleCreateAndAssociateCollaborator = async (data: Omit<Collaborator, 'id'>) => {
    if (!selectedAppId) return;
    const coll = await almService.saveCollaborator(data);
    await almService.associateCollaborator(selectedAppId, coll.id);
    await loadData();
  };

  const handleDeleteCollaboratorGlobal = async (collId: string) => {
    if (!confirm("Excluir o colaborador permanentemente do ecossistema?")) return;
    await almService.deleteCollaborator(collId);
    await loadData();
  };

  const handleSaveMonitoring = async (data: any) => {
    if (!selectedAppId) return;
    await almService.saveMonitoring(data);
    await loadDetails(selectedAppId);
  };

  const handleSaveRoadmap = async (data: Omit<Roadmap, 'id'> & { id?: string }) => {
    if (!selectedAppId) return;
    await almService.saveRoadmapItem(data);
    await loadDetails(selectedAppId);
  };

  const handleDeleteRoadmap = async (id: string) => {
    if (!selectedAppId || !confirm("Excluir atividade do roadmap?")) return;
    await almService.deleteRoadmapItem(id);
    await loadDetails(selectedAppId);
  };

  const handleSaveStack = async (data: Omit<Stack, 'id'> & { id?: string }) => {
    if (!selectedAppId) return;
    await almService.saveStack(data);
    await loadDetails(selectedAppId);
  };

  const handleDeleteStack = async (id: string) => {
    if (!confirm("Excluir item da stack?")) return;
    await almService.deleteStack(id);
    if (selectedAppId) await loadDetails(selectedAppId);
  };

  const handleSaveCliente = async (data: Omit<Cliente, 'id'> & { id?: string }) => {
    if (!selectedAppId) return;
    await almService.saveCliente(data);
    await loadDetails(selectedAppId);
  };

  const handleDeleteCliente = async (id: string) => {
    if (!confirm("Excluir cliente?")) return;
    await almService.deleteCliente(id);
    if (selectedAppId) await loadDetails(selectedAppId);
  };

  const handleSaveClienteAtividade = async (data: Omit<ClienteAtividade, 'id'> & { id?: string }) => {
    await almService.saveClienteAtividade(data);
  };

  const handleDeleteClienteAtividade = async (id: string) => {
    await almService.deleteClienteAtividade(id);
  };

  const handleLoadClienteAtividades = async (clienteId: string): Promise<ClienteAtividade[]> => {
    return almService.getClienteAtividades(clienteId);
  };

  const handleSaveOcorrencia = async (data: Omit<Ocorrencia, 'id'> & { id?: string }) => {
    if (!selectedAppId) return;
    await almService.saveOcorrencia(data);
    await loadDetails(selectedAppId);
  };

  const handleDeleteOcorrencia = async (id: string) => {
    if (!confirm("Excluir ocorrência?")) return;
    await almService.deleteOcorrencia(id);
    if (selectedAppId) await loadDetails(selectedAppId);
  };

  const handleSaveConfluenceRef = async (data: Omit<ConfluenceReference, 'id'> & { id?: string }) => {
    if (!selectedAppId) return;
    await almService.saveConfluenceReference(data);
    await loadDetails(selectedAppId);
  };

  const handleDeleteConfluenceRef = async (id: string) => {
    if (!confirm("Excluir referência do Confluence?")) return;
    await almService.deleteConfluenceReference(id);
    if (selectedAppId) await loadDetails(selectedAppId);
  };

  const filteredApps = apps.filter(app =>
    app.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.proposito && app.proposito.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      {/* Banner de status */}
      <div className="flex items-center justify-between px-6 py-1.5 text-[11px] border-b"
        style={{
          backgroundColor: isSupabaseConfigured ? 'var(--gcp-green-bg)' : 'var(--amber-bg)',
          borderColor: 'var(--border)',
          color: isSupabaseConfigured ? 'var(--gcp-green)' : 'var(--gcp-amber)'
        }}>
        <div className="flex items-center gap-2">
          {isSupabaseConfigured
            ? <><CheckCircle2 size={12} /> <span>Supabase ativo — dados persistidos no PostgreSQL</span></>
            : <><AlertTriangle size={12} /> <span>Modo local — configure o <code className="px-1 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>.env.local</code> para ativar o banco</span></>
          }
        </div>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-2.5 border-b shrink-0"
        style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded flex items-center justify-center" style={{ width: 30, height: 30, backgroundColor: 'var(--blue-primary)' }}>
              <Rocket size={16} color="white" />
            </div>
            <div>
              <div className="font-medium text-sm leading-none" style={{ color: 'var(--text-primary)' }}>
                Gestão de Aplicação
              </div>
              <div className="text-[10px] leading-none mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Gerenciador de Aplicações
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
            <span className="hover:underline cursor-pointer" style={{ color: 'var(--text-primary)' }}>Aplicações</span>
            {selectedDetails && (
              <>
                <ChevronRight size={12} />
                <span style={{ color: 'var(--blue-primary)' }}>{selectedDetails.application.nome}</span>
              </>
            )}
            <span className="mx-1" style={{ color: 'var(--text-muted)' }}>|</span>
            <Link href="/about" className="hover:underline cursor-pointer flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              <Info size={11} /> Sobre
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
        </div>
      </header>

      {/* Layout Principal */}
      <main className="flex-1 flex overflow-hidden" style={{ backgroundColor: 'var(--bg-page)' }}>
        {/* Sidebar */}
        <aside className="w-72 flex flex-col shrink-0 border-r"
          style={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border)' }}>
          <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Pesquisar aplicação..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} className="input-gcp pl-8 w-full" />
              </div>
              <button onClick={() => { setSelectedAppId(null); setSelectedDetails(null); setShowCreateApp(true); }}
                title="Nova Aplicação" className="btn-primary flex items-center justify-center shrink-0" style={{ padding: '6px 10px' }}>
                <Plus size={15} />
              </button>
            </div>
          </div>

          <div className="px-3 py-2 text-[11px] flex items-center justify-between border-b"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
            <span>{filteredApps.length} aplicação{filteredApps.length !== 1 ? 'ões' : ''}</span>
            <Layers size={12} />
          </div>

          <div className="flex-1 overflow-y-auto py-1">
            {loading && apps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3" style={{ color: 'var(--text-muted)' }}>
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: 'var(--blue-primary)', borderTopColor: 'transparent' }} />
                <span className="text-[12px]">Carregando...</span>
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="text-center py-10 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                Nenhuma aplicação encontrada.
              </div>
            ) : (
              filteredApps.map((app) => {
                const isSelected = selectedAppId === app.id;
                return (
                  <div key={app.id} onClick={() => handleSelectApp(app.id)}
                    className="group relative mx-1.5 mb-0.5 rounded-md cursor-pointer transition-all duration-100"
                    style={{ backgroundColor: isSelected ? 'var(--bg-selected)' : 'transparent', padding: '8px 10px' }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    <div className="flex items-start justify-between gap-1">
                      <div className="font-medium text-[13px] leading-tight truncate"
                        style={{ color: isSelected ? 'var(--blue-primary)' : 'var(--text-primary)' }}>
                        {app.nome}
                      </div>
                      <button onClick={(e) => handleDeleteApp(app.id, e)}
                        className="opacity-0 group-hover:opacity-100 shrink-0 p-0.5 rounded transition-opacity"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--gcp-red)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                    {app.proposito && (
                      <p className="text-[12px] mt-1 truncate leading-snug" style={{ color: 'var(--text-secondary)' }}>
                        {app.proposito}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-2">
                      {app.ambiente_prd && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: 'var(--gcp-green-bg)', color: 'var(--gcp-green)' }}>PRD</span>
                      )}
                      {app.ambiente_hml && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' }}>HML</span>
                      )}
                      {app.monitoring?.grafana_url && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: 'var(--blue-light)', color: 'var(--blue-primary)' }}>Grafana</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Conteúdo */}
        <section className="flex-1 overflow-hidden flex flex-col relative" style={{ backgroundColor: 'var(--bg-page)' }}>
          {showCreateApp ? (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto">
                <AppForm onSubmit={handleCreateAppSubmit} onCancel={() => setShowCreateApp(false)} />
              </div>
            </div>
          ) : selectedAppId && selectedDetails ? (
            <div className="flex-1 overflow-hidden relative">
              {detailsLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(var(--bg-page), 0.7)', backdropFilter: 'blur(2px)' }}>
                  <div className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: 'var(--blue-primary)', borderTopColor: 'transparent' }} />
                    Atualizando...
                  </div>
                </div>
              )}
              <AppDetails
                details={selectedDetails}
                allCollaborators={collaborators}
                onRefresh={() => loadDetails(selectedAppId)}
                onSaveSubModule={handleSaveSubModule}
                onDeleteSubModule={handleDeleteSubModule}
                onSaveEndpoint={handleSaveEndpoint}
                onDeleteEndpoint={handleDeleteEndpoint}
                onAssociateCollaborator={handleAssociateCollaborator}
                onDissociateCollaborator={handleDissociateCollaborator}
                onCreateAndAssociateCollaborator={handleCreateAndAssociateCollaborator}
                onDeleteCollaboratorGlobal={handleDeleteCollaboratorGlobal}
                onSaveMonitoring={handleSaveMonitoring}
                onSaveRoadmap={handleSaveRoadmap}
                onDeleteRoadmap={handleDeleteRoadmap}
                onUpdateAppBasic={handleUpdateAppBasic}
                onSaveStack={handleSaveStack}
                onDeleteStack={handleDeleteStack}
                onSaveCliente={handleSaveCliente}
                onDeleteCliente={handleDeleteCliente}
                onSaveClienteAtividade={handleSaveClienteAtividade}
                onDeleteClienteAtividade={handleDeleteClienteAtividade}
                onLoadClienteAtividades={handleLoadClienteAtividades}
                onSaveOcorrencia={handleSaveOcorrencia}
                onDeleteOcorrencia={handleDeleteOcorrencia}
                onSaveConfluenceRef={handleSaveConfluenceRef}
                onDeleteConfluenceRef={handleDeleteConfluenceRef}
              />
            </div>
          ) : (
            /* Welcome Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="max-w-md space-y-5">
                <div className="flex items-center justify-center">
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--blue-light)', border: '1px solid var(--border)' }}>
                    <Rocket size={30} style={{ color: 'var(--blue-primary)' }} />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Gestão de Aplicação
                  </h2>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Selecione uma aplicação na barra lateral para visualizar e gerenciar sua documentação, time, roadmap e monitoramento.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-1">
                  {[
                    { icon: <Layers size={16} />, label: 'Aplicações', value: apps.length },
                    { icon: <Database size={16} />, label: 'Integrações', value: apps.length * 2 },
                    { icon: <Users size={16} />, label: 'Colaboradores', value: collaborators.length },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg p-3 text-left"
                      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                      <div className="flex items-center gap-1.5 mb-2" style={{ color: 'var(--blue-primary)' }}>{stat.icon}</div>
                      <div className="font-semibold text-lg leading-none" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                      <div className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setShowCreateApp(true); setSelectedAppId(null); }}
                  className="btn-primary flex items-center gap-2 mx-auto" style={{ padding: '8px 20px' }}>
                  <Plus size={15} /> Nova Aplicação
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
