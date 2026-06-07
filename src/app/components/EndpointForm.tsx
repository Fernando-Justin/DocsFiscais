"use client";

import React, { useState, useEffect } from 'react';
import { Endpoint, AmbienteDisponivel, EndpointStatus } from '@/domain/entities/Endpoint';
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
  const [parametros, setParametros] = useState('');
  const [exemploResponse, setExemploResponse] = useState('');
  const [statusCodes, setStatusCodes] = useState('');
  const [authExigida, setAuthExigida] = useState(false);
  const [authTipo, setAuthTipo] = useState('');
  const [ambiente, setAmbiente] = useState('Ambos');
  const [endpointStatus, setEndpointStatus] = useState('Ativo');
  const [payloadExemplo, setPayloadExemplo] = useState('');
  const [comandoCurl, setComandoCurl] = useState('');

  useEffect(() => {
    if (initialData) {
      setMetodo(initialData.metodo || 'GET');
      setPath(initialData.path || '');
      setDescricao(initialData.descricao || '');
      setSubmoduleId(initialData.submodule_id || '');
      setParametros(initialData.parametros || '');
      setExemploResponse(initialData.exemplo_response || '');
      setStatusCodes(initialData.status_codes || '');
      setAuthExigida(initialData.auth_exigida || false);
      setAuthTipo(initialData.auth_tipo || '');
      setAmbiente(initialData.ambiente_disponivel || 'Ambos');
      setEndpointStatus(initialData.status || 'Ativo');
      setPayloadExemplo(initialData.payload_exemplo || '');
      setComandoCurl(initialData.comando_curl || '');
    } else {
      setMetodo('GET'); setPath(''); setDescricao('');
      setSubmoduleId(''); setParametros(''); setExemploResponse('');
      setStatusCodes(''); setAuthExigida(false); setAuthTipo('');
      setAmbiente('Ambos'); setEndpointStatus('Ativo');
      setPayloadExemplo(''); setComandoCurl('');
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
      parametros: parametros || null,
      payload_exemplo: payloadExemplo || null,
      exemplo_response: exemploResponse || null,
      status_codes: statusCodes || null,
      auth_exigida: authExigida,
      auth_tipo: authTipo || null,
      ambiente_disponivel: ambiente as AmbienteDisponivel,
      status: endpointStatus as EndpointStatus,
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

        <div className="col-span-2">
          <label className="label-compact">Parâmetros</label>
          <textarea value={parametros} onChange={e => setParametros(e.target.value)}
            placeholder="query: ?page=1&limit=10&#10;path: /{id}" rows={3}
            className="input-gcp resize-none font-mono" style={{ fontSize: 11 }} />
        </div>

        <div className="col-span-2">
          <label className="label-compact">Exemplo Response</label>
          <textarea value={exemploResponse} onChange={e => setExemploResponse(e.target.value)}
            placeholder='{"id": 1, "nome": "..."}' rows={3}
            className="input-gcp resize-none font-mono" style={{ fontSize: 11 }} />
        </div>

        <div className="col-span-2">
          <label className="label-compact">Status Codes</label>
          <textarea value={statusCodes} onChange={e => setStatusCodes(e.target.value)}
            placeholder="200: OK&#10;400: Bad Request&#10;404: Not Found" rows={3}
            className="input-gcp resize-none font-mono" style={{ fontSize: 11 }} />
        </div>

        <div className="col-span-2">
          <label className="label-compact">Autenticação</label>
          <div className="flex items-center gap-2 mb-1">
            <label className="flex items-center gap-1 text-[11px]">
              <input type="checkbox" checked={authExigida} onChange={e => setAuthExigida(e.target.checked)} />
              Exige Auth
            </label>
          </div>
          <select value={authTipo} onChange={e => setAuthTipo(e.target.value)} className="input-gcp"
            style={{ fontSize: 11, display: authExigida ? 'block' : 'none' }}>
            <option value="">Selecionar tipo...</option>
            <option value="Bearer Token">Bearer Token</option>
            <option value="Basic Auth">Basic Auth</option>
            <option value="API Key">API Key</option>
            <option value="JWT">JWT</option>
            <option value="OAuth 2.0">OAuth 2.0</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="label-compact">Ambiente</label>
          <select value={ambiente} onChange={e => setAmbiente(e.target.value)} className="input-gcp">
            <option value="Ambos">Ambos</option>
            <option value="Homologação">Homologação</option>
            <option value="Produção">Produção</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="label-compact">Status do Endpoint</label>
          <select value={endpointStatus} onChange={e => setEndpointStatus(e.target.value)} className="input-gcp">
            <option value="Ativo">Ativo</option>
            <option value="Desativado">Desativado</option>
            <option value="Em desenvolvimento">Em desenvolvimento</option>
            <option value="Depreciado">Depreciado</option>
          </select>
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
