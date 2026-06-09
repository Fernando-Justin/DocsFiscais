"use client";

import React, { useState } from 'react';
import { Monitoring } from '@/domain/entities/Monitoring';
import { Ocorrencia, OcorrenciaTipo, OcorrenciaAmbiente, OcorrenciaOfensor, OcorrenciaStatus } from '@/domain/entities/Ocorrencia';
import { Collaborator } from '@/domain/entities/Collaborator';
import { getStatusStyle } from './statusStyles';
import {
  Plus, Trash2, ExternalLink, Activity, Clock, AlertTriangle,
  Search, BarChart3, Database, Globe, Pencil
} from 'lucide-react';

interface MonitoringSectionProps {
  applicationId: string;
  monitoring: Monitoring | null;
  ocorrencias: Ocorrencia[];
  collaborators: Collaborator[];
  onSaveMonitoring: (data: any) => Promise<void>;
  onSaveOcorrencia: (data: Omit<Ocorrencia, 'id'> & { id?: string }) => Promise<void>;
  onDeleteOcorrencia: (id: string) => Promise<void>;
}

const OFENSOR_SUGGESTIONS: Record<string, string[]> = {
  'Indisponibilidade total': ['Restart do servidor de aplicação', 'Failover para banco de dados secundário', 'Acionar equipe de infraestrutura'],
  'Degradação de performance': ['Escalar horizontalmente pods/servidores', 'Identificar query lenta no banco', 'Aumentar recursos de memória/CPU'],
  'Erro funcional': ['Rollback do último deploy', 'Identificar commit que introduziu o erro', 'Aplicar hotfix'],
  'Alerta de monitoramento': ['Verificar dashboard de métricas', 'Validar latency e throughput', 'Verificar logs de erro'],
  'Manutenção programada': ['Comunicar usuários afetados', 'Executar procedimento de manutenção', 'Validar ambiente pós-manutenção'],
};

const OFENSOR_TIP: Record<string, string[]> = {
  'Banco de dados': ['Verificar conexões ativas', 'Analisar slow queries', 'Verificar replicação'],
  'Infraestrutura / Cloud': ['Verificar recursos de cloud', 'Analisar logs de infraestrutura', 'Verificar balanceadores'],
  'Código da aplicação': ['Analisar logs da aplicação', 'Verificar exceções recentes', 'Revisar último deploy'],
  'Integração externa': ['Verificar status do provedor externo', 'Validar timeout de chamadas', 'Testar endpoint externo'],
};

export default function MonitoringSection({
  applicationId, monitoring, ocorrencias, collaborators,
  onSaveMonitoring, onSaveOcorrencia, onDeleteOcorrencia
}: MonitoringSectionProps) {
  const [activeSubSection, setActiveSubSection] = useState<'monitoring' | 'ocorrencias'>('ocorrencias');
  const [showOcorrenciaForm, setShowOcorrenciaForm] = useState(false);
  const [showMonitoringForm, setShowMonitoringForm] = useState(false);

  const [monGrafana, setMonGrafana] = useState(monitoring?.grafana_url || '');
  const [monDatadog, setMonDatadog] = useState(monitoring?.datadog_url || '');

  const [editingOcorrenciaId, setEditingOcorrenciaId] = useState<string | null>(null);
  const [ocTitulo, setOcTitulo] = useState('');
  const [ocTipo, setOcTipo] = useState<OcorrenciaTipo>('Erro funcional');
  const [ocAmbiente, setOcAmbiente] = useState<OcorrenciaAmbiente>('Produção');
  const [ocOfensor, setOcOfensor] = useState<OcorrenciaOfensor>('Não identificado');
  const [ocOfensorOutro, setOcOfensorOutro] = useState('');
  const [ocDataInicio, setOcDataInicio] = useState('');
  const [ocHoraInicio, setOcHoraInicio] = useState('');
  const [ocDataFim, setOcDataFim] = useState('');
  const [ocHoraFim, setOcHoraFim] = useState('');
  const [ocStatus, setOcStatus] = useState<OcorrenciaStatus>('Em andamento');
  const [ocAcoes, setOcAcoes] = useState('');
  const [ocObservacoes, setOcObservacoes] = useState('');
  const [ocRegistradoPor, setOcRegistradoPor] = useState('');

  const resetOcorrenciaForm = () => {
    setEditingOcorrenciaId(null);
    setOcTitulo(''); setOcTipo('Erro funcional'); setOcAmbiente('Produção');
    setOcOfensor('Não identificado'); setOcOfensorOutro('');
    setOcDataInicio(''); setOcHoraInicio(''); setOcDataFim(''); setOcHoraFim('');
    setOcStatus('Em andamento'); setOcAcoes(''); setOcObservacoes(''); setOcRegistradoPor('');
  };

  const startEditOcorrencia = (oc: Ocorrencia) => {
    setEditingOcorrenciaId(oc.id);
    setOcTitulo(oc.titulo);
    setOcTipo(oc.tipo);
    setOcAmbiente(oc.ambiente);
    setOcOfensor(oc.ofensor);
    setOcOfensorOutro(oc.ofensor_outro || '');
    const inicio = new Date(oc.data_hora_inicio);
    setOcDataInicio(inicio.toISOString().slice(0, 10));
    setOcHoraInicio(inicio.toISOString().slice(11, 16));
    if (oc.data_hora_normalizacao) {
      const fim = new Date(oc.data_hora_normalizacao);
      setOcDataFim(fim.toISOString().slice(0, 10));
      setOcHoraFim(fim.toISOString().slice(11, 16));
    } else {
      setOcDataFim(''); setOcHoraFim('');
    }
    setOcStatus(oc.status);
    setOcAcoes(oc.acoes_tomadas || '');
    setOcObservacoes(oc.observacoes || '');
    setOcRegistradoPor(oc.registrado_por || '');
    setShowOcorrenciaForm(true);
  };

  const handleMonitoringSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveMonitoring({
      id: monitoring?.id, application_id: applicationId,
      grafana_url: monGrafana || null, datadog_url: monDatadog || null,
      links: monitoring?.links || [],
    });
    setShowMonitoringForm(false);
  };

  const handleOcorrenciaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ocTitulo.trim() || !ocDataInicio || !ocHoraInicio) return;
    const inicio = new Date(`${ocDataInicio}T${ocHoraInicio}`).toISOString();
    const fim = (ocDataFim && ocHoraFim) ? new Date(`${ocDataFim}T${ocHoraFim}`).toISOString() : null;
    const tempoMinutos = fim ? Math.round((new Date(fim).getTime() - new Date(inicio).getTime()) / 60000) : null;
    await onSaveOcorrencia({
      id: editingOcorrenciaId || undefined,
      application_id: applicationId, titulo: ocTitulo.trim(), tipo: ocTipo, ambiente: ocAmbiente,
      ofensor: ocOfensor, ofensor_outro: ocOfensor === 'Outro' ? ocOfensorOutro.trim() || null : null,
      data_hora_inicio: inicio, data_hora_normalizacao: fim,
      tempo_total_minutos: tempoMinutos, status: ocStatus,
      acoes_tomadas: ocAcoes.trim() || null, observacoes: ocObservacoes.trim() || null,
      registrado_por: ocRegistradoPor || null,
    });
    resetOcorrenciaForm();
    setShowOcorrenciaForm(false);
  };

  const handleTipoChange = (tipo: OcorrenciaTipo) => {
    setOcTipo(tipo);
    const suggestions = OFENSOR_SUGGESTIONS[tipo];
    if (suggestions && !ocAcoes) {
      setOcAcoes(suggestions[0]);
    }
  };

  const handleOfensorChange = (ofensor: OcorrenciaOfensor) => {
    setOcOfensor(ofensor);
    const tips = OFENSOR_TIP[ofensor];
    if (tips && !ocObservacoes) {
      setOcObservacoes(tips.join('. '));
    }
  };

  const totalIncidents = ocorrencias.length;
  const avgResolution = ocorrencias
    .filter(o => o.tempo_total_minutos)
    .reduce((acc, o) => acc + (o.tempo_total_minutos || 0), 0) / Math.max(ocorrencias.filter(o => o.tempo_total_minutos).length, 1);
  const ofensorCount: Record<string, number> = {};
  ocorrencias.forEach(o => { ofensorCount[o.ofensor] = (ofensorCount[o.ofensor] || 0) + 1; });
  const topOfensor = Object.entries(ofensorCount).sort((a, b) => b[1] - a[1])[0];

  const recentOcorrencias = [...ocorrencias].sort((a, b) => new Date(b.data_hora_inicio).getTime() - new Date(a.data_hora_inicio).getTime());

  const getCollaboratorName = (id: string | null) => {
    if (!id) return '';
    const c = collaborators.find(c => c.id === id);
    return c?.nome || id;
  };

  return (
    <div className="space-y-3">
      {/* Sub-navegação */}
      <div className="flex border-b gap-0" style={{ borderColor: 'var(--border)' }}>
        {(['ocorrencias', 'monitoring'] as const).map(sub => (
          <button key={sub} onClick={() => setActiveSubSection(sub)}
            className="px-3 py-2 text-[12px] font-medium border-b-2 transition-colors"
            style={{
              borderBottomColor: activeSubSection === sub ? 'var(--blue-primary)' : 'transparent',
              color: activeSubSection === sub ? 'var(--blue-primary)' : 'var(--text-secondary)',
            }}>
            {sub === 'ocorrencias' ? `Ocorrências (${ocorrencias.length})` : 'Monitoramento'}
          </button>
        ))}
      </div>

      {/* Ocorrências */}
      {activeSubSection === 'ocorrencias' && (
        <div className="space-y-3">
          {/* Indicadores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border p-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle size={14} style={{ color: totalIncidents > 0 ? 'var(--gcp-amber)' : 'var(--gcp-green)' }} />
                <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{totalIncidents}</span>
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Total de Incidentes</div>
            </div>
            <div className="rounded-lg border p-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={14} style={{ color: 'var(--blue-primary)' }} />
                <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {Math.round(avgResolution)}min
                </span>
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Tempo Médio de Normalização</div>
            </div>
            <div className="rounded-lg border p-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <BarChart3 size={14} style={{ color: 'var(--gcp-purple)' }} />
                <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {topOfensor ? topOfensor[0] : 'N/A'}
                </span>
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Ofensor Mais Frequente</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border overflow-hidden"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between px-3 py-2 border-b"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-hover)' }}>
              <span className="text-[12px] font-medium flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                <Activity size={12} /> Histórico de Ocorrências
              </span>
              <button onClick={() => {
                if (showOcorrenciaForm) { setShowOcorrenciaForm(false); resetOcorrenciaForm(); }
                else { resetOcorrenciaForm(); setShowOcorrenciaForm(true); }
              }}
                className="flex items-center gap-1 text-[11px] font-medium" style={{ color: 'var(--blue-primary)' }}>
                <Plus size={11} /> Nova Ocorrência
              </button>
            </div>

            {showOcorrenciaForm && (
              <form onSubmit={handleOcorrenciaSubmit} className="p-3 border-b space-y-2" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <label className="label-compact">Título / Resumo *</label>
                  <input type="text" required value={ocTitulo} onChange={e => setOcTitulo(e.target.value)}
                    placeholder="Ex: Timeout no Gateway de Pagamentos" className="input-gcp" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="label-compact">Tipo</label>
                    <select value={ocTipo} onChange={e => handleTipoChange(e.target.value as OcorrenciaTipo)} className="input-gcp">
                      {(['Indisponibilidade total', 'Degradação de performance', 'Erro funcional', 'Alerta de monitoramento', 'Manutenção programada'] as OcorrenciaTipo[]).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-compact">Ambiente</label>
                    <select value={ocAmbiente} onChange={e => setOcAmbiente(e.target.value as OcorrenciaAmbiente)} className="input-gcp">
                      <option value="Produção">Produção</option>
                      <option value="Homologação">Homologação</option>
                      <option value="Ambos">Ambos</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-compact">Ofensor</label>
                    <select value={ocOfensor} onChange={e => handleOfensorChange(e.target.value as OcorrenciaOfensor)} className="input-gcp">
                      {(['Banco de dados', 'Infraestrutura / Cloud', 'Código da aplicação', 'Integração externa', 'Rede', 'Deploy / Release', 'Não identificado', 'Outro'] as OcorrenciaOfensor[]).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-compact">Status</label>
                    <select value={ocStatus} onChange={e => setOcStatus(e.target.value as OcorrenciaStatus)} className="input-gcp">
                      <option value="Em andamento">Em andamento</option>
                      <option value="Normalizado">Normalizado</option>
                      <option value="Monitorando">Monitorando</option>
                    </select>
                  </div>
                </div>
                {ocOfensor === 'Outro' && (
                  <div>
                    <label className="label-compact">Qual ofensor?</label>
                    <input type="text" value={ocOfensorOutro} onChange={e => setOcOfensorOutro(e.target.value)} className="input-gcp" placeholder="Descreva o ofensor..." />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="label-compact">Data/Hora Início *</label>
                    <div className="flex gap-1">
                      <input type="date" required value={ocDataInicio} onChange={e => setOcDataInicio(e.target.value)} className="input-gcp flex-1" />
                      <input type="time" required value={ocHoraInicio} onChange={e => setOcHoraInicio(e.target.value)} className="input-gcp w-28" />
                    </div>
                  </div>
                  <div>
                    <label className="label-compact">Data/Hora Normalização</label>
                    <div className="flex gap-1">
                      <input type="date" value={ocDataFim} onChange={e => setOcDataFim(e.target.value)} className="input-gcp flex-1" />
                      <input type="time" value={ocHoraFim} onChange={e => setOcHoraFim(e.target.value)} className="input-gcp w-28" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label-compact">Ações Tomadas</label>
                  <textarea value={ocAcoes} onChange={e => setOcAcoes(e.target.value)}
                    placeholder="Descreva as ações realizadas para estabilização..." rows={2} className="input-gcp resize-none" />
                </div>
                <div>
                  <label className="label-compact">Observações</label>
                  <textarea value={ocObservacoes} onChange={e => setOcObservacoes(e.target.value)}
                    placeholder="Informações adicionais..." rows={2} className="input-gcp resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="label-compact">Registrado por</label>
                    <input type="text" value={ocRegistradoPor} onChange={e => setOcRegistradoPor(e.target.value)}
                      placeholder="Nome do colaborador" className="input-gcp" />
                  </div>
                  {ocDataFim && ocHoraFim && ocDataInicio && ocHoraInicio && (
                    <div>
                      <label className="label-compact">Tempo Total de Impacto</label>
                      <div className="input-gcp bg-[var(--bg-hover)] text-[13px] font-mono" style={{ cursor: 'default' }}>
                        {Math.round((new Date(`${ocDataFim}T${ocHoraFim}`).getTime() - new Date(`${ocDataInicio}T${ocHoraInicio}`).getTime()) / 60000)} min
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t" style={{ borderColor: 'var(--border)' }}>
                  {editingOcorrenciaId && <span className="text-[11px]" style={{ color: 'var(--gcp-amber)' }}>Editando ocorrência</span>}
                  <div className="flex gap-2 ml-auto">
                    <button type="button" onClick={() => { setShowOcorrenciaForm(false); resetOcorrenciaForm(); }} className="btn-secondary text-[11px]">Cancelar</button>
                    <button type="submit" className="btn-primary text-[11px]">{editingOcorrenciaId ? 'Salvar' : 'Registrar Ocorrência'}</button>
                  </div>
                </div>
              </form>
            )}

            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {recentOcorrencias.length === 0 ? (
                <p className="text-[12px] text-center py-6" style={{ color: 'var(--text-muted)' }}>Nenhuma ocorrência registrada.</p>
              ) : recentOcorrencias.map(oc => {
                const stStyle = getStatusStyle(oc.status);
                const inicio = new Date(oc.data_hora_inicio).toLocaleString('pt-BR');
                const fim = oc.data_hora_normalizacao ? new Date(oc.data_hora_normalizacao).toLocaleString('pt-BR') : null;
                return (
                  <div key={oc.id} className="group flex items-start justify-between px-3 py-2.5 transition-colors hover:bg-[var(--bg-hover)]">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{oc.titulo}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0"
                          style={{ backgroundColor: stStyle.bg, color: stStyle.color }}>{oc.status}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        <span>{oc.tipo}</span>
                        <span>{oc.ambiente}</span>
                        <span>Ofensor: {oc.ofensor}{oc.ofensor_outro ? ` (${oc.ofensor_outro})` : ''}</span>
                        {oc.tempo_total_minutos && <span>{oc.tempo_total_minutos} min</span>}
                        <span className="text-[10px] font-mono">{inicio}</span>
                        {fim && <span className="text-[10px] font-mono">→ {fim}</span>}
                        {oc.registrado_por && <span>por {getCollaboratorName(oc.registrado_por)}</span>}
                      </div>
                      {oc.acoes_tomadas && (
                        <p className="text-[11px] mt-1 truncate" style={{ color: 'var(--text-muted)' }}>
                          Ações: {oc.acoes_tomadas}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0 ml-2">
                      <button onClick={() => startEditOcorrencia(oc)}
                        className="p-0.5 rounded transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--blue-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                        title="Editar">
                        <Pencil size={11} />
                      </button>
                      <button onClick={() => onDeleteOcorrencia(oc.id)}
                        className="p-0.5 rounded"
                        style={{ color: 'var(--gcp-red)' }}
                        title="Excluir">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Monitoramento Links */}
      {activeSubSection === 'monitoring' && (
        <div className="space-y-3">
          {/* Ambientes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderLeftWidth: 4, borderLeftColor: 'var(--gcp-amber)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: 'var(--gcp-amber)' }}>HOMOLOGAÇÃO (HML)</div>
              <p className="font-mono text-[11px] mb-2" style={{ color: 'var(--text-secondary)' }}>
                {monitoring?.grafana_url || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Não configurado</span>}
              </p>
            </div>
            <div className="rounded-lg border p-3"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderLeftWidth: 4, borderLeftColor: 'var(--gcp-green)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: 'var(--gcp-green)' }}>PRODUÇÃO (PRD)</div>
              <p className="font-mono text-[11px] mb-2" style={{ color: 'var(--text-secondary)' }}>
                {monitoring?.datadog_url || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Não configurado</span>}
              </p>
            </div>
          </div>

          {/* Links de Monitoramento */}
          <div className="rounded-lg border overflow-hidden"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between px-3 py-2 border-b"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-hover)' }}>
              <span className="text-[12px] font-medium flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                <BarChart3 size={12} /> Links de Monitoramento
              </span>
              <button onClick={() => setShowMonitoringForm(!showMonitoringForm)}
                className="flex items-center gap-1 text-[11px] font-medium" style={{ color: 'var(--blue-primary)' }}>
                <Plus size={11} /> Configurar
              </button>
            </div>

            {showMonitoringForm && (
              <form onSubmit={handleMonitoringSubmit} className="p-3 border-b space-y-2" style={{ borderColor: 'var(--border)' }}>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="label-compact">Grafana URL</label>
                    <input type="url" value={monGrafana} onChange={e => setMonGrafana(e.target.value)}
                      placeholder="https://grafana.company.com/d/..." className="input-gcp" />
                  </div>
                  <div>
                    <label className="label-compact">Datadog URL</label>
                    <input type="url" value={monDatadog} onChange={e => setMonDatadog(e.target.value)}
                      placeholder="https://app.datadoghq.com/apm/..." className="input-gcp" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1.5 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button type="button" onClick={() => setShowMonitoringForm(false)} className="btn-secondary text-[11px]">Cancelar</button>
                  <button type="submit" className="btn-primary text-[11px]">Salvar</button>
                </div>
              </form>
            )}

            {/* Lista de links existentes */}
            <div className="p-3 space-y-1.5">
              {(monitoring?.links || []).length === 0 ? (
                <p className="text-[12px] text-center py-2" style={{ color: 'var(--text-muted)' }}>
                  Nenhum link de monitoramento configurado.
                </p>
              ) : (monitoring?.links || []).map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noreferrer"
                  className="flex items-center justify-between rounded border px-3 py-2 hover:bg-[var(--bg-hover)] transition-colors group"
                  style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2.5">
                    <BarChart3 size={14} style={{ color: 'var(--blue-primary)' }} />
                    <div>
                      <div className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>{link.nome}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        {link.descricao}
                        {link.responsavel && <span className="ml-2">• {link.responsavel}</span>}
                      </div>
                    </div>
                  </div>
                  <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
