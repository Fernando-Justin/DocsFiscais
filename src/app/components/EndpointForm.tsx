"use client";

import React, { useState, useEffect } from 'react';
import { Endpoint } from '@/domain/entities/Endpoint';
import { SubModule } from '@/domain/entities/SubModule';
import { Plus, Zap } from 'lucide-react';

interface EndpointFormProps {
  applicationId: string;
  subModules: SubModule[];
  initialData?: Endpoint | null;
  onSubmit: (data: Omit<Endpoint, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function EndpointForm({ applicationId, subModules, initialData, onSubmit, onCancel }: EndpointFormProps) {
  const [metodo, setMetodo] = useState('GET');
  const [path, setPath] = useState('');
  const [descricao, setDescricao] = useState('');
  const [submoduleId, setSubmoduleId] = useState('');
  const [payloadExemplo, setPayloadExemplo] = useState('');
  const [comandoCurl, setComandoCurl] = useState('');

  useEffect(() => {
    if (initialData) {
      setMetodo(initialData.metodo || 'GET');
      setPath(initialData.path || '');
      setDescricao(initialData.descricao || '');
      setSubmoduleId(initialData.submodule_id || '');
      setPayloadExemplo(initialData.payload_exemplo || '');
      setComandoCurl(initialData.comando_curl || '');
    } else {
      setMetodo('GET'); setPath(''); setDescricao('');
      setSubmoduleId(''); setPayloadExemplo(''); setComandoCurl('');
    }
  }, [initialData]);

  const handleAutoGenerateCurl = () => {
    const cleanPath = path.trim() || '/api/v1/resource';
    let curl = `curl -X ${metodo} https://api.company.com${cleanPath} \\\n  -H "Content-Type: application/json"`;
    if (['POST', 'PUT', 'PATCH'].includes(metodo) && payloadExemplo) {
      try {
        const minified = JSON.stringify(JSON.parse(payloadExemplo));
        curl += ` \\\n  -d '${minified}'`;
      } catch {
        curl += ` \\\n  -d '${payloadExemplo.replace(/\n/g, '').trim()}'`;
      }
    }
    setComandoCurl(curl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!path.trim()) return;
    onSubmit({
      id: initialData?.id,
      application_id: applicationId,
      submodule_id: submoduleId || null,
      metodo,
      path: path.trim(),
      descricao: descricao || null,
      payload_exemplo: payloadExemplo || null,
      comando_curl: comandoCurl || null,
    });
  };

  const METHOD_COLORS: Record<string, string> = {
    GET: 'var(--gcp-green)', POST: 'var(--blue-primary)', PUT: 'var(--gcp-amber)',
    DELETE: 'var(--gcp-red)', PATCH: 'var(--gcp-purple)',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div className="grid grid-cols-6 gap-2">
        <div className="col-span-2">
          <label className="label-compact">Método *</label>
          <select value={metodo} onChange={e => setMetodo(e.target.value)} className="input-gcp"
            style={{ color: METHOD_COLORS[metodo] || "var(--text-primary)", fontWeight: 600, fontFamily: 'monospace' }}>
            {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="col-span-4">
          <label className="label-compact">Path *</label>
          <input type="text" required value={path} onChange={e => setPath(e.target.value)}
            placeholder="/api/v1/..." className="input-gcp font-mono" />
        </div>

        <div className="col-span-3">
          <label className="label-compact">Submódulo Relacionado</label>
          <select value={submoduleId} onChange={e => setSubmoduleId(e.target.value)} className="input-gcp">
            <option value="">Nenhum (Direto na Aplicação)</option>
            {subModules.map(sm => <option key={sm.id} value={sm.id}>{sm.nome}</option>)}
          </select>
        </div>

        <div className="col-span-3">
          <label className="label-compact">Descrição Simplificada</label>
          <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)}
            placeholder="O que este endpoint faz..." className="input-gcp" />
        </div>

        <div className="col-span-3">
          <div className="flex items-center justify-between mb-0.5">
            <label className="label-compact" style={{ marginBottom: 0 }}>Payload Exemplo (JSON)</label>
            {payloadExemplo && (
              <button type="button" onClick={() => {
                try { setPayloadExemplo(JSON.stringify(JSON.parse(payloadExemplo), null, 2)); } catch {}
              }} className="text-[10px]" style={{ color: "var(--blue-primary)" }}>Formatar</button>
            )}
          </div>
          <textarea value={payloadExemplo} onChange={e => setPayloadExemplo(e.target.value)}
            placeholder={'{\n  "key": "value"\n}'} rows={5}
            className="input-gcp resize-none font-mono" style={{ fontSize: 11 }} />
        </div>

        <div className="col-span-3">
          <div className="flex items-center justify-between mb-0.5">
            <label className="label-compact" style={{ marginBottom: 0 }}>Comando cURL</label>
            <button type="button" onClick={handleAutoGenerateCurl}
              className="flex items-center gap-0.5 text-[10px] font-medium"
              style={{ color: "var(--blue-primary)" }}>
              <Zap size={10} /> Autogerar
            </button>
          </div>
          <textarea value={comandoCurl} onChange={e => setComandoCurl(e.target.value)}
            placeholder="curl -X GET ..." rows={5}
            className="input-gcp resize-none font-mono" style={{ fontSize: 11 }} />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
        <button type="button" onClick={onCancel} className="btn-secondary text-[11px]">Cancelar</button>
        <button type="submit" className="btn-primary text-[11px]">Salvar Endpoint</button>
      </div>
    </form>
  );
}
