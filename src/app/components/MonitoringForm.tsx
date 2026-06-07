"use client";

import React, { useState, useEffect } from 'react';
import { Monitoring } from '@/domain/entities/Monitoring';

interface MonitoringFormProps {
  applicationId: string;
  initialData?: Monitoring | null;
  onSubmit: (data: Omit<Monitoring, 'id'> & { id?: string }) => void;
  onCancel?: () => void;
}

export default function MonitoringForm({ applicationId, initialData, onSubmit, onCancel }: MonitoringFormProps) {
  const [grafanaUrl, setGrafanaUrl] = useState('');
  const [datadogUrl, setDatadogUrl] = useState('');

  useEffect(() => {
    if (initialData) { setGrafanaUrl(initialData.grafana_url || ''); setDatadogUrl(initialData.datadog_url || ''); }
    else { setGrafanaUrl(''); setDatadogUrl(''); }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: initialData?.id, application_id: applicationId, links: initialData?.links || [], grafana_url: grafanaUrl || null, datadog_url: datadogUrl || null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label-compact">URL do Dashboard Grafana</label>
          <input type="url" value={grafanaUrl} onChange={e => setGrafanaUrl(e.target.value)}
            placeholder="https://grafana.company.com/d/..." className="input-gcp" />
        </div>
        <div>
          <label className="label-compact">URL do Serviço Datadog APM</label>
          <input type="url" value={datadogUrl} onChange={e => setDatadogUrl(e.target.value)}
            placeholder="https://app.datadoghq.com/apm/..." className="input-gcp" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
        {onCancel && <button type="button" onClick={onCancel} className="btn-secondary text-[11px]">Cancelar</button>}
        <button type="submit" className="btn-primary text-[11px]">Salvar Monitoramento</button>
      </div>
    </form>
  );
}
