export const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  'Ativo':             { bg: 'var(--gcp-green-bg)', color: 'var(--gcp-green)' },
  'OK':                { bg: 'var(--gcp-green-bg)', color: 'var(--gcp-green)' },
  'Concluído':         { bg: 'var(--gcp-green-bg)', color: 'var(--gcp-green)' },
  'Concluída':         { bg: 'var(--gcp-green-bg)', color: 'var(--gcp-green)' },
  'Normalizado':       { bg: 'var(--gcp-green-bg)', color: 'var(--gcp-green)' },
  'Em andamento':      { bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' },
  'Em desenvolvimento':{ bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' },
  'Em homologação':    { bg: 'var(--blue-light)',   color: 'var(--blue-primary)' },
  'Monitorando':       { bg: 'var(--blue-light)',   color: 'var(--blue-primary)' },
  'Em avaliação':      { bg: 'var(--blue-light)',   color: 'var(--blue-primary)' },
  'Em atualização':    { bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' },
  'Degradado':         { bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' },
  'Bloqueado':         { bg: 'var(--gcp-red-bg)',   color: 'var(--gcp-red)' },
  'Off-line':          { bg: 'var(--gcp-red-bg)',   color: 'var(--gcp-red)' },
  'Crítico':           { bg: 'var(--gcp-red-bg)',   color: 'var(--gcp-red)' },
  'Inativo':           { bg: 'var(--bg-hover)',      color: 'var(--text-muted)' },
  'Cancelado':         { bg: 'var(--bg-hover)',      color: 'var(--text-muted)' },
  'Backlog':           { bg: 'var(--bg-hover)',      color: 'var(--text-secondary)' },
  'Planejado':         { bg: 'var(--blue-light)',   color: 'var(--blue-primary)' },
  'Pendente':          { bg: 'var(--bg-hover)',      color: 'var(--text-secondary)' },
  'Em análise':        { bg: 'var(--blue-light)',   color: 'var(--blue-primary)' },
  'Recusado':          { bg: 'var(--gcp-red-bg)',   color: 'var(--gcp-red)' },
  'Temporário':        { bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)' },
  'Depreciado':        { bg: 'var(--bg-hover)',      color: 'var(--text-muted)' },
};

export const METHOD_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  GET:     { bg: 'var(--gcp-green-bg)',  color: 'var(--gcp-green)',  border: 'var(--gcp-green)' },
  POST:    { bg: 'var(--blue-light)',    color: 'var(--blue-primary)', border: 'var(--blue-primary)' },
  PUT:     { bg: 'var(--gcp-amber-bg)', color: 'var(--gcp-amber)',  border: 'var(--gcp-amber)' },
  DELETE:  { bg: 'var(--gcp-red-bg)',   color: 'var(--gcp-red)',    border: 'var(--gcp-red)' },
  PATCH:   { bg: '#F3E5FF',             color: 'var(--gcp-purple)', border: 'var(--gcp-purple)' },
  OPTIONS: { bg: 'var(--bg-hover)',     color: 'var(--text-muted)', border: 'var(--border)' },
};

export function getStatusStyle(status: string): { bg: string; color: string } {
  return STATUS_COLORS[status] || { bg: 'var(--bg-hover)', color: 'var(--text-secondary)' };
}
