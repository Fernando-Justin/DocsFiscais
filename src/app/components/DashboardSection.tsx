"use client";

import React from 'react';
import { ApplicationDetails } from '@/adapters/in/usecase';
import {
  CheckCircle2, AlertTriangle, XCircle, Users, Calendar,
  Activity, ExternalLink, Clock, Bug
} from 'lucide-react';

interface DashboardSectionProps {
  details: ApplicationDetails;
}

export default function DashboardSection({ details }: DashboardSectionProps) {
  const { application, roadmap, collaborators, clientes, ocorrencias } = details;

  const statusPrd = ocorrencias.some(o => o.status === 'Em andamento' && (o.ambiente === 'Produção' || o.ambiente === 'Ambos'))
    ? ocorrencias.find(o => o.status === 'Em andamento' && (o.ambiente === 'Produção' || o.ambiente === 'Ambos'))
    : null;
  const statusHml = ocorrencias.some(o => o.status === 'Em andamento' && (o.ambiente === 'Homologação' || o.ambiente === 'Ambos'))
    ? ocorrencias.find(o => o.status === 'Em andamento' && (o.ambiente === 'Homologação' || o.ambiente === 'Ambos'))
    : null;

  const envStatus = (status: typeof statusPrd, label: string, isPrd: boolean) => {
    let icon, color, text;
    if (status) {
      icon = <XCircle size={14} />;
      color = 'var(--gcp-red)';
      text = status.tipo;
    } else {
      icon = <CheckCircle2 size={14} />;
      color = 'var(--gcp-green)';
      text = 'OK';
    }
    return (
      <div className="flex items-center gap-2">
        <span style={{ color }}>{icon}</span>
        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</div>
          <div className="text-[13px] font-semibold" style={{ color }}>{text}</div>
        </div>
      </div>
    );
  };

  const lastOccurrence = ocorrencias.length > 0
    ? ocorrencias.sort((a, b) => new Date(b.data_hora_inicio).getTime() - new Date(a.data_hora_inicio).getTime())[0]
    : null;

  const activeAlerts = ocorrencias.filter(o => o.status === 'Em andamento' || o.status === 'Monitorando');
  const roadmapAbertos = roadmap.filter(r => r.status !== 'Concluído' && r.status !== 'Cancelado');
  const clientesAtivos = clientes.filter(c => c.status === 'Ativo');

  const metrics = [
    { label: 'Clientes Ativos', value: clientesAtivos.length, icon: <Users size={16} />, color: 'var(--blue-primary)' },
    { label: 'Itens no Roadmap', value: roadmapAbertos.length, icon: <Calendar size={16} />, color: 'var(--gcp-amber)' },
    { label: 'Alertas Ativos', value: activeAlerts.length, icon: <Activity size={16} />, color: activeAlerts.length > 0 ? 'var(--gcp-red)' : 'var(--gcp-green)' },
    { label: 'Colaboradores', value: collaborators.length, icon: <Users size={16} />, color: 'var(--text-secondary)' },
  ];

  return (
    <div className="space-y-4">
      {/* Status dos Ambientes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg border p-3" style={{
          backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)',
          borderLeftWidth: 4, borderLeftColor: statusPrd ? 'var(--gcp-red)' : 'var(--gcp-green)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {envStatus(statusPrd, 'Produção', true)}
        </div>
        <div className="rounded-lg border p-3" style={{
          backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)',
          borderLeftWidth: 4, borderLeftColor: statusHml ? 'var(--gcp-amber)' : 'var(--blue-primary)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {envStatus(statusHml, 'Homologação', false)}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map(m => (
          <div key={m.label} className="rounded-lg border p-3" style={{
            backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ color: m.color }}>{m.icon}</div>
            <div className="text-lg font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>{m.value}</div>
            <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Última Ocorrência + Links Rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Última Ocorrência */}
        <div className="rounded-lg border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="px-3 py-2 border-b text-[12px] font-medium flex items-center gap-1.5"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}>
            <Clock size={12} /> Última Ocorrência
          </div>
          {lastOccurrence ? (
            <div className="p-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>{lastOccurrence.titulo}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                  style={{
                    backgroundColor: lastOccurrence.status === 'Normalizado' ? 'var(--gcp-green-bg)' : 'var(--gcp-amber-bg)',
                    color: lastOccurrence.status === 'Normalizado' ? 'var(--gcp-green)' : 'var(--gcp-amber)'
                  }}>
                  {lastOccurrence.status}
                </span>
              </div>
              <div className="flex gap-3 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                <span>{lastOccurrence.tipo}</span>
                <span>{lastOccurrence.ambiente}</span>
                {lastOccurrence.tempo_total_minutos && (
                  <span>{lastOccurrence.tempo_total_minutos}min de impacto</span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-[12px]" style={{ color: 'var(--text-muted)' }}>
              Nenhuma ocorrência registrada.
            </div>
          )}
        </div>

        {/* Links Rápidos */}
        <div className="rounded-lg border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="px-3 py-2 border-b text-[12px] font-medium"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}>
            Acesso Rápido
          </div>
          <div className="p-3 space-y-1.5">
            {application.ambiente_prd && (
              <a href={application.ambiente_prd} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] hover:bg-[var(--bg-hover)] transition-colors"
                style={{ color: 'var(--blue-primary)' }}>
                <ExternalLink size={12} /> Produção
              </a>
            )}
            {application.ambiente_hml && (
              <a href={application.ambiente_hml} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded text-[12px] hover:bg-[var(--bg-hover)] transition-colors"
                style={{ color: 'var(--gcp-amber)' }}>
                <ExternalLink size={12} /> Homologação
              </a>
            )}
            <div className="flex items-center gap-2 px-2.5 py-1.5 text-[12px]"
              style={{ color: 'var(--text-secondary)' }}>
              <Bug size={12} /> {ocorrencias.length} ocorrência{ocorrencias.length !== 1 ? 's' : ''} registrada{ocorrencias.length !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 text-[12px]"
              style={{ color: 'var(--text-secondary)' }}>
              <Calendar size={12} /> {roadmapAbertos.length} itens abertos no Roadmap
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
