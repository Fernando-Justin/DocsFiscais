import { Application } from '@/domain/entities/Application';
import { SubModule } from '@/domain/entities/SubModule';
import { Endpoint } from '@/domain/entities/Endpoint';
import { Collaborator } from '@/domain/entities/Collaborator';
import { Monitoring } from '@/domain/entities/Monitoring';
import { Roadmap } from '@/domain/entities/Roadmap';
import { Stack } from '@/domain/entities/Stack';
import { Cliente } from '@/domain/entities/Cliente';
import { ClienteAtividade } from '@/domain/entities/ClienteAtividade';
import { Ocorrencia } from '@/domain/entities/Ocorrencia';
import { ConfluenceReference } from '@/domain/entities/ConfluenceReference';

const isBrowser = typeof window !== 'undefined';

const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (!isBrowser) return defaultValue;
  const stored = localStorage.getItem(`alm_${key}`);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (isBrowser) {
    localStorage.setItem(`alm_${key}`, JSON.stringify(value));
  }
};

const initialApps: Application[] = [
  {
    id: 'app-1',
    nome: 'Customer Portal',
    proposito: 'Frontend principal de autoatendimento para clientes finais acessarem faturas e histórico de consumo.',
    escopo: 'Canal B2C Web de alto tráfego com integração direta ao Gateway de Pagamentos e Core Financeiro.',
    ambiente_hml: 'https://hml-customer.company.com',
    ambiente_prd: 'https://customer.company.com',
    link_confluence: 'https://confluence.company.com/pages/customer-portal'
  },
  {
    id: 'app-2',
    nome: 'Payment Gateway API',
    proposito: 'API rest de processamento de pagamentos, estornos e conciliação bancária multi-adquirente.',
    escopo: 'Core API utilizada por todas as aplicações do ecossistema para faturamento recorrente e transações avulsas.',
    ambiente_hml: 'https://hml-api-payments.company.com',
    ambiente_prd: 'https://api-payments.company.com',
    link_confluence: 'https://confluence.company.com/pages/payments-api'
  },
  {
    id: 'app-3',
    nome: 'Notification Microservice',
    proposito: 'Serviço assíncrono de mensageria para envio de e-mails, SMS e notificações Push.',
    escopo: 'Consumidor de tópicos RabbitMQ/Kafka, responsável pela entrega de mensagens com política de retentativa.',
    ambiente_hml: 'https://hml-notifier.company.com',
    ambiente_prd: 'https://notifier.company.com',
    link_confluence: 'https://confluence.company.com/pages/notification-service'
  }
];

const initialSubmodules: SubModule[] = [
  { id: 'sub-1', application_id: 'app-2', nome: 'Auth Integration', proposito: 'Módulo de autenticação Oauth2 e validação de tokens JWT das adquirentes.' },
  { id: 'sub-2', application_id: 'app-2', nome: 'Anti-fraud Analyzer', proposito: 'Comunicação síncrona com parceiro externo para análise de risco transacional.' },
  { id: 'sub-3', application_id: 'app-3', nome: 'Email Provider adapter', proposito: 'Integração com SendGrid e Amazon SES para envio transacional de e-mails.' }
];

const initialEndpoints: Endpoint[] = [
  {
    id: 'end-1', application_id: 'app-2', submodule_id: 'sub-1',
    metodo: 'POST', path: '/api/v1/auth/token',
    descricao: 'Geração de token de acesso temporário para parceiros integrados.',
    parametros: null,
    payload_exemplo: '{\n  "client_id": "api_partner_99",\n  "client_secret": "sec_82138a0b12"\n}',
    exemplo_response: '{\n  "access_token": "eyJhbGciOiJSUzI1NiIs...",\n  "expires_in": 3600\n}',
    status_codes: '200: Sucesso\n401: Credenciais inválidas\n500: Erro interno',
    auth_exigida: false, auth_tipo: null,
    ambiente_disponivel: 'Ambos', status: 'Ativo',
    comando_curl: 'curl -X POST https://api-payments.company.com/api/v1/auth/token \\\n  -H "Content-Type: application/json" \\\n  -d \'{"client_id": "api_partner_99", "client_secret": "sec_82138a0b12"}\''
  },
  {
    id: 'end-2', application_id: 'app-2', submodule_id: 'sub-2',
    metodo: 'POST', path: '/api/v1/payments/charge',
    descricao: 'Processamento de cobrança de cartão de crédito e débito com fluxo antifraude.',
    parametros: '[{"nome":"amount","tipo":"number","obrigatorio":true,"descricao":"Valor da cobrança"},{"nome":"currency","tipo":"string","obrigatorio":true,"descricao":"Moeda (BRL)"},{"nome":"payment_method","tipo":"string","obrigatorio":true,"descricao":"credit_card ou debit_card"}]',
    payload_exemplo: '{\n  "amount": 150.90,\n  "currency": "BRL",\n  "payment_method": "credit_card"\n}',
    exemplo_response: '{\n  "transaction_id": "txn_8a7f3d2e",\n  "status": "approved",\n  "amount": 150.90\n}',
    status_codes: '200: Pagamento aprovado\n400: Dados inválidos\n402: Pagamento recusado\n500: Erro interno',
    auth_exigida: true, auth_tipo: 'Bearer JWT',
    ambiente_disponivel: 'Ambos', status: 'Ativo',
    comando_curl: 'curl -X POST https://api-payments.company.com/api/v1/payments/charge \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -d \'{"amount": 150.90, "currency": "BRL", "payment_method": "credit_card"}\''
  },
  {
    id: 'end-3', application_id: 'app-3', submodule_id: 'sub-3',
    metodo: 'POST', path: '/api/v1/notifications/email',
    descricao: 'Envio assíncrono de e-mail transacional com suporte a templates HTML pré-carregados.',
    parametros: '[{"nome":"to","tipo":"string","obrigatorio":true,"descricao":"Destinatário"},{"nome":"template_id","tipo":"string","obrigatorio":true,"descricao":"ID do template"},{"nome":"vars","tipo":"object","obrigatorio":false,"descricao":"Variáveis do template"}]',
    payload_exemplo: '{\n  "to": "dev@company.com",\n  "template_id": "welcome_email",\n  "vars": { "name": "Fernando" }\n}',
    exemplo_response: '{\n  "message_id": "msg_abc123",\n  "status": "queued"\n}',
    status_codes: '200: Enfileirado\n400: Dados inválidos\n500: Erro interno',
    auth_exigida: true, auth_tipo: 'API Key',
    ambiente_disponivel: 'Ambos', status: 'Ativo',
    comando_curl: 'curl -X POST https://notifier.company.com/api/v1/notifications/email \\\n  -H "Content-Type: application/json" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -d \'{"to": "dev@company.com", "template_id": "welcome_email", "vars": {"name": "Fernando"}}\''
  }
];

const initialCollaborators: Collaborator[] = [
  { id: 'col-1', nome: 'Fernando Silva', squad: 'Squad Checkout & Pay', papel: 'Desenvolvedor', email: 'fernando.silva@company.com', contato: null, status: 'Ativo', nivel_acesso: 'Total' },
  { id: 'col-2', nome: 'Justin Bieber', squad: 'Squad Core API', papel: 'Desenvolvedor', email: 'justin.b@company.com', contato: null, status: 'Ativo', nivel_acesso: 'Total' },
  { id: 'col-3', nome: 'Ana Souza', squad: 'Squad Channels & Portal', papel: 'Tech Lead', email: 'ana.souza@company.com', contato: null, status: 'Ativo', nivel_acesso: 'Administrativo' }
];

interface AppCollaboratorRelation {
  application_id: string;
  collaborator_id: string;
}

const initialRelations: AppCollaboratorRelation[] = [
  { application_id: 'app-2', collaborator_id: 'col-1' },
  { application_id: 'app-2', collaborator_id: 'col-2' },
  { application_id: 'app-1', collaborator_id: 'col-3' },
  { application_id: 'app-3', collaborator_id: 'col-1' }
];

const initialMonitoring: Monitoring[] = [
  {
    id: 'mon-1', application_id: 'app-1',
    grafana_url: 'https://grafana.company.com/d/customer-portal',
    datadog_url: 'https://datadog.company.com/apm/service/customer-portal',
    links: [
      { id: 'ml-1', application_id: 'app-1', nome: 'Grafana Customer Portal', url: 'https://grafana.company.com/d/customer-portal', descricao: 'Dashboard principal de métricas do Customer Portal', responsavel: 'NOC' },
      { id: 'ml-2', application_id: 'app-1', nome: 'Datadog APM', url: 'https://datadog.company.com/apm/service/customer-portal', descricao: 'APM e tracing de requisições', responsavel: 'NOC' }
    ]
  },
  {
    id: 'mon-2', application_id: 'app-2',
    grafana_url: 'https://grafana.company.com/d/payment-gateway',
    datadog_url: 'https://datadog.company.com/apm/service/payment-gateway',
    links: [
      { id: 'ml-3', application_id: 'app-2', nome: 'Grafana Payment Gateway', url: 'https://grafana.company.com/d/payment-gateway', descricao: 'Dashboard de métricas do Gateway de Pagamentos', responsavel: 'NOC' },
      { id: 'ml-4', application_id: 'app-2', nome: 'Datadog APM', url: 'https://datadog.company.com/apm/service/payment-gateway', descricao: 'APM e tracing de transações', responsavel: 'NOC' },
      { id: 'ml-5', application_id: 'app-2', nome: 'New Relic DB', url: 'https://newrelic.company.com/dbs/payments', descricao: 'Monitoramento de banco de dados de pagamentos', responsavel: 'DBA' }
    ]
  },
  {
    id: 'mon-3', application_id: 'app-3',
    grafana_url: 'https://grafana.company.com/d/notification-service',
    datadog_url: 'https://datadog.company.com/apm/service/notification-service',
    links: [
      { id: 'ml-6', application_id: 'app-3', nome: 'Grafana Notifications', url: 'https://grafana.company.com/d/notification-service', descricao: 'Dashboard de métricas do serviço de notificações', responsavel: 'NOC' }
    ]
  }
];

const initialRoadmap: Roadmap[] = [
  { id: 'road-1', application_id: 'app-2', atividade: 'Integração com adquirente Stone API', detalhamento: 'Integração completa incluindo fluxo de pagamento, estorno e conciliação.', categoria: 'Evolução técnica', prioridade: 'Alta', data_prevista_inicio: '2026-01-01', data_prevista_finalizacao: '2026-03-31', trimestre: 'Q1', ano: 2026, status: 'Concluído', responsavel: 'Fernando Silva', observacoes: 'Stone homologou em fevereiro' },
  { id: 'road-2', application_id: 'app-2', atividade: 'Upgrade de Segurança PCI-DSS Compliance', detalhamento: 'Atualização de certificação PCI-DSS versão 4.0 com melhorias de criptografia.', categoria: 'Exigência fiscal/regulatória', prioridade: 'Crítica', data_prevista_inicio: '2026-04-01', data_prevista_finalizacao: '2026-06-30', trimestre: 'Q2', ano: 2026, status: 'Em andamento', responsavel: 'Fernando Silva', observacoes: 'Prazo final determinado pelo compliance' },
  { id: 'road-3', application_id: 'app-2', atividade: 'Suporte a pagamentos instantâneos via Pix', detalhamento: 'Implementação do fluxo Pix Pix2Pix com QR Code dinâmico e estático.', categoria: 'Evolução técnica', prioridade: 'Alta', data_prevista_inicio: null, data_prevista_finalizacao: '2026-09-30', trimestre: 'Q3', ano: 2026, status: 'Backlog', responsavel: null, observacoes: 'Aguardando definição do produto' },
  { id: 'road-4', application_id: 'app-1', atividade: 'Redesenho de acessibilidade WCAG 2.1', detalhamento: null, categoria: 'Correção / Débito técnico', prioridade: 'Média', data_prevista_inicio: '2026-01-10', data_prevista_finalizacao: null, trimestre: 'Q1', ano: 2026, status: 'Concluído', responsavel: 'Ana Souza', observacoes: null },
  { id: 'road-5', application_id: 'app-1', atividade: 'Implementação de Login Social (Google/Apple)', detalhamento: 'Integração OAuth2 com Google Sign-in e Apple Sign-in.', categoria: 'Evolução técnica', prioridade: 'Média', data_prevista_inicio: '2026-03-01', data_prevista_finalizacao: '2026-04-30', trimestre: 'Q2', ano: 2026, status: 'Em andamento', responsavel: 'Ana Souza', observacoes: null },
  { id: 'road-6', application_id: 'app-3', atividade: 'Integração com WhatsApp Business API', detalhamento: 'Canal de notificação via WhatsApp Business API para alertas transacionais.', categoria: 'Demanda de cliente', prioridade: 'Baixa', data_prevista_inicio: null, data_prevista_finalizacao: null, trimestre: 'Q3', ano: 2026, status: 'Bloqueado', responsavel: 'Fernando Silva', observacoes: 'Aguardando aprovação da Meta' },
  { id: 'road-7', application_id: 'app-3', atividade: 'Otimização de consumo e envio em lote', detalhamento: null, categoria: 'Infraestrutura', prioridade: 'Baixa', data_prevista_inicio: null, data_prevista_finalizacao: null, trimestre: 'Q4', ano: 2026, status: 'Backlog', responsavel: null, observacoes: null }
];

const initialStacks: Stack[] = [
  { id: 'stack-1', application_id: 'app-1', nome: 'React', versao: '19.2', categoria: 'Framework', status: 'Ativo', observacao: 'Framework principal do frontend' },
  { id: 'stack-2', application_id: 'app-1', nome: 'TypeScript', versao: '5.7', categoria: 'Linguagem', status: 'Ativo', observacao: null },
  { id: 'stack-3', application_id: 'app-2', nome: 'Node.js', versao: '22', categoria: 'Linguagem', status: 'Ativo', observacao: 'Runtime principal da API' },
  { id: 'stack-4', application_id: 'app-2', nome: 'PostgreSQL', versao: '16', categoria: 'Banco de Dados', status: 'Ativo', observacao: null },
  { id: 'stack-5', application_id: 'app-2', nome: 'Express.js', versao: '4.21', categoria: 'Framework', status: 'Ativo', observacao: null },
  { id: 'stack-6', application_id: 'app-2', nome: 'Redis', versao: '7.4', categoria: 'Banco de Dados', status: 'Ativo', observacao: 'Cache distribuído' },
  { id: 'stack-7', application_id: 'app-3', nome: 'Python', versao: '3.13', categoria: 'Linguagem', status: 'Em atualização', observacao: 'Migrando de Node.js para Python' },
  { id: 'stack-8', application_id: 'app-3', nome: 'RabbitMQ', versao: '4.0', categoria: 'Mensageria', status: 'Ativo', observacao: 'Message broker principal' },
  { id: 'stack-9', application_id: 'app-2', nome: 'Docker', versao: '27', categoria: 'Infraestrutura', status: 'Ativo', observacao: 'Conteinerização' },
  { id: 'stack-10', application_id: 'app-2', nome: 'Grafana', versao: '11.5', categoria: 'Observabilidade', status: 'Ativo', observacao: 'Métricas e dashboards' }
];

const initialClientes: Cliente[] = [
  { id: 'cli-1', application_id: 'app-1', nome_empresa: 'Financeiro S.A.', area_referencia: 'Squad Checkout', contato: 'Maria Silva - maria.silva@company.com', status: 'Ativo', endpoints: [] },
  { id: 'cli-2', application_id: 'app-1', nome_empresa: 'Gestão Ltda.', area_referencia: 'Vertical Financeiro', contato: 'João Santos - joao.santos@company.com', status: 'Ativo', endpoints: [] },
  { id: 'cli-3', application_id: 'app-2', nome_empresa: 'Core Payments', area_referencia: 'Squad Core API', contato: 'Ana Beatriz - ana.beatriz@company.com', status: 'Ativo', endpoints: [{ endpoint_id: 'end-2', observacao: 'Endpoint principal de cobrança' }] },
  { id: 'cli-4', application_id: 'app-2', nome_empresa: 'Gestão Empresarial', area_referencia: 'Produto Gestão', contato: 'Carlos Eduardo - carlos.edu@company.com', status: 'Em Homologação', endpoints: [] },
  { id: 'cli-5', application_id: 'app-3', nome_empresa: 'Comunicação Total', area_referencia: 'Área de Negócio', contato: 'Pedro Lima - pedro.lima@company.com', status: 'Inativo', endpoints: [{ endpoint_id: 'end-3', observacao: 'Endpoint de e-mail transacional' }] }
];

const initialClienteAtividades: ClienteAtividade[] = [
  { id: 'atv-1', cliente_id: 'cli-1', descritivo: 'Migração de layout do dashboard financeiro', status: 'Em desenvolvimento', data_prevista_inicio: '2026-01-15', data_prevista_conclusao: '2026-02-28', observacao: null },
  { id: 'atv-2', cliente_id: 'cli-1', descritivo: 'Configuração de novo relatório de vendas', status: 'Pendente', data_prevista_inicio: '2026-03-01', data_prevista_conclusao: '2026-03-15', observacao: 'Aguardando definição dos campos' },
  { id: 'atv-3', cliente_id: 'cli-3', descritivo: 'Integração com novo adquirente', status: 'Em desenvolvimento', data_prevista_inicio: '2026-01-10', data_prevista_conclusao: '2026-04-30', observacao: null },
  { id: 'atv-4', cliente_id: 'cli-4', descritivo: 'Homologação de ambiente de produção', status: 'Pendente', data_prevista_inicio: '2026-02-01', data_prevista_conclusao: '2026-02-28', observacao: 'Ambiente já liberado' },
  { id: 'atv-5', cliente_id: 'cli-5', descritivo: 'Reativação de acesso ao sistema', status: 'Recusado', data_prevista_inicio: null, data_prevista_conclusao: null, observacao: null }
];

const initialOcorrencias: Ocorrencia[] = [
  {
    id: 'oc-1', application_id: 'app-2',
    titulo: 'Indisponibilidade do Gateway de Pagamentos',
    tipo: 'Indisponibilidade total', ambiente: 'Produção',
    ofensor: 'Banco de dados', ofensor_outro: null,
    data_hora_inicio: '2026-05-15T14:30:00Z', data_hora_normalizacao: '2026-05-15T15:45:00Z',
    tempo_total_minutos: 75, status: 'Normalizado',
    acoes_tomadas: 'Restart do cluster PostgreSQL. Failover para réplica de leitura.',
    observacoes: 'Causa raiz: pico de conexões simultâneas sem pooler.',
    registrado_por: 'col-1'
  },
  {
    id: 'oc-2', application_id: 'app-2',
    titulo: 'Timeout em chamadas de cobrança',
    tipo: 'Degradação de performance', ambiente: 'Produção',
    ofensor: 'Integração externa', ofensor_outro: null,
    data_hora_inicio: '2026-05-20T10:00:00Z', data_hora_normalizacao: '2026-05-20T10:30:00Z',
    tempo_total_minutos: 30, status: 'Normalizado',
    acoes_tomadas: 'Acionado suporte da adquirente. Rate limit ajustado.',
    observacoes: 'Adquirente externa estava com instabilidade.',
    registrado_por: 'col-2'
  },
  {
    id: 'oc-3', application_id: 'app-1',
    titulo: 'Erro ao carregar dashboard de faturas',
    tipo: 'Erro funcional', ambiente: 'Produção',
    ofensor: 'Código da aplicação', ofensor_outro: null,
    data_hora_inicio: '2026-06-01T08:15:00Z', data_hora_normalizacao: '2026-06-01T09:00:00Z',
    tempo_total_minutos: 45, status: 'Normalizado',
    acoes_tomadas: 'Rollback do último deploy. Correção aplicada em hotfix.',
    observacoes: 'Regressão introduzida no deploy da v2.3.1.',
    registrado_por: 'col-3'
  }
];

const initialConfluenceReferences: ConfluenceReference[] = [
  { id: 'cr-1', application_id: 'app-2', titulo: 'Arquitetura do Payment Gateway', url: 'https://confluence.company.com/pages/payments-arch', categoria: 'Arquitetura', descricao: 'Diagrama C4 e decisões arquiteturais do gateway de pagamentos.', ultima_atualizacao: '2026-04-15' },
  { id: 'cr-2', application_id: 'app-2', titulo: 'Runbook: Incidentes em Produção', url: 'https://confluence.company.com/pages/payments-runbook', categoria: 'Runbook', descricao: 'Procedimentos para resposta a incidentes no gateway.', ultima_atualizacao: '2026-05-20' },
  { id: 'cr-3', application_id: 'app-1', titulo: 'Manual do Usuário - Customer Portal', url: 'https://confluence.company.com/pages/customer-manual', categoria: 'Manual do usuário', descricao: 'Guia completo de uso do portal do cliente.', ultima_atualizacao: '2026-03-10' },
  { id: 'cr-4', application_id: 'app-3', titulo: 'ADR: Migração de Node.js para Python', url: 'https://confluence.company.com/pages/notifier-adr', categoria: 'ADR', descricao: 'Registro de decisão arquitetural para migração de runtime.', ultima_atualizacao: '2026-02-28' }
];

export const mockDatabase = {
  getApplications: () => getStorageItem<Application[]>('applications', initialApps),
  setApplications: (val: Application[]) => setStorageItem('applications', val),

  getSubmodules: () => getStorageItem<SubModule[]>('submodules', initialSubmodules),
  setSubmodules: (val: SubModule[]) => setStorageItem('submodules', val),

  getEndpoints: () => getStorageItem<Endpoint[]>('endpoints', initialEndpoints),
  setEndpoints: (val: Endpoint[]) => setStorageItem('endpoints', val),

  getCollaborators: () => getStorageItem<Collaborator[]>('collaborators', initialCollaborators),
  setCollaborators: (val: Collaborator[]) => setStorageItem('collaborators', val),

  getRelations: () => getStorageItem<AppCollaboratorRelation[]>('relations', initialRelations),
  setRelations: (val: AppCollaboratorRelation[]) => setStorageItem('relations', val),

  getMonitoring: () => getStorageItem<Monitoring[]>('monitoring', initialMonitoring),
  setMonitoring: (val: Monitoring[]) => setStorageItem('monitoring', val),

  getRoadmap: () => getStorageItem<Roadmap[]>('roadmap', initialRoadmap),
  setRoadmap: (val: Roadmap[]) => setStorageItem('roadmap', val),

  getStacks: () => getStorageItem<Stack[]>('stacks', initialStacks),
  setStacks: (val: Stack[]) => setStorageItem('stacks', val),

  getClientes: () => getStorageItem<Cliente[]>('clientes', initialClientes),
  setClientes: (val: Cliente[]) => setStorageItem('clientes', val),

  getClienteAtividades: () => getStorageItem<ClienteAtividade[]>('cliente_atividades', initialClienteAtividades),
  setClienteAtividades: (val: ClienteAtividade[]) => setStorageItem('cliente_atividades', val),

  getOcorrencias: () => getStorageItem<Ocorrencia[]>('ocorrencias', initialOcorrencias),
  setOcorrencias: (val: Ocorrencia[]) => setStorageItem('ocorrencias', val),

  getConfluenceReferences: () => getStorageItem<ConfluenceReference[]>('confluence_references', initialConfluenceReferences),
  setConfluenceReferences: (val: ConfluenceReference[]) => setStorageItem('confluence_references', val),
};
