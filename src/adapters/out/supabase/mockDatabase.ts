import { Application } from '@/domain/entities/Application';
import { SubModule } from '@/domain/entities/SubModule';
import { Endpoint } from '@/domain/entities/Endpoint';
import { Collaborator } from '@/domain/entities/Collaborator';
import { Monitoring } from '@/domain/entities/Monitoring';
import { Roadmap } from '@/domain/entities/Roadmap';

// Helper para gerenciar estados em localStorage (se rodando no client)
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

// Dados Iniciais de Demonstração (Wow Factor)
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
  {
    id: 'sub-1',
    application_id: 'app-2',
    nome: 'Auth Integration',
    proposito: 'Módulo de autenticação Oauth2 e validação de tokens JWT das adquirentes.'
  },
  {
    id: 'sub-2',
    application_id: 'app-2',
    nome: 'Anti-fraud Analyzer',
    proposito: 'Comunicação síncrona com parceiro externo para análise de risco transacional.'
  },
  {
    id: 'sub-3',
    application_id: 'app-3',
    nome: 'Email Provider adapter',
    proposito: 'Integração com SendGrid e Amazon SES para envio transacional de e-mails.'
  }
];

const initialEndpoints: Endpoint[] = [
  {
    id: 'end-1',
    application_id: 'app-2',
    submodule_id: 'sub-1',
    metodo: 'POST',
    path: '/api/v1/auth/token',
    descricao: 'Geração de token de acesso temporário para parceiros integrados.',
    payload_exemplo: '{\n  "client_id": "api_partner_99",\n  "client_secret": "sec_82138a0b12"\n}',
    comando_curl: 'curl -X POST https://api-payments.company.com/api/v1/auth/token \\\n  -H "Content-Type: application/json" \\\n  -d \'{"client_id": "api_partner_99", "client_secret": "sec_82138a0b12"}\''
  },
  {
    id: 'end-2',
    application_id: 'app-2',
    submodule_id: 'sub-2',
    metodo: 'POST',
    path: '/api/v1/payments/charge',
    descricao: 'Processamento de cobrança de cartão de crédito e débito com fluxo antifraude.',
    payload_exemplo: '{\n  "amount": 150.90,\n  "currency": "BRL",\n  "payment_method": "credit_card",\n  "card": {\n    "number": "4111********1111",\n    "holder": "Fernando J Silva",\n    "expiration": "12/29",\n    "cvv": "123"\n  }\n}',
    comando_curl: 'curl -X POST https://api-payments.company.com/api/v1/payments/charge \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -d \'{"amount": 150.90, "currency": "BRL", "payment_method": "credit_card"}\''
  },
  {
    id: 'end-3',
    application_id: 'app-3',
    submodule_id: 'sub-3',
    metodo: 'POST',
    path: '/api/v1/notifications/email',
    descricao: 'Envio assíncrono de e-mail transacional com suporte a templates HTML pré-carregados.',
    payload_exemplo: '{\n  "to": "dev@company.com",\n  "template_id": "welcome_email",\n  "vars": {\n    "name": "Fernando"\n  }\n}',
    comando_curl: 'curl -X POST https://notifier.company.com/api/v1/notifications/email \\\n  -H "Content-Type: application/json" \\\n  -d \'{"to": "dev@company.com", "template_id": "welcome_email", "vars": {"name": "Fernando"}}\''
  }
];

const initialCollaborators: Collaborator[] = [
  { id: 'col-1', nome: 'Fernando Silva', squad: 'Squad Checkout & Pay', papel: 'mantenedor', email: 'fernando.silva@company.com' },
  { id: 'col-2', nome: 'Justin Bieber', squad: 'Squad Core API', papel: 'dev', email: 'justin.b@company.com' },
  { id: 'col-3', nome: 'Ana Souza', squad: 'Squad Channels & Portal', papel: 'dev', email: 'ana.souza@company.com' }
];

// Associação Colaborador x Aplicação
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
    id: 'mon-1',
    application_id: 'app-1',
    grafana_url: 'https://grafana.company.com/d/customer-portal',
    datadog_url: 'https://datadog.company.com/apm/service/customer-portal'
  },
  {
    id: 'mon-2',
    application_id: 'app-2',
    grafana_url: 'https://grafana.company.com/d/payment-gateway',
    datadog_url: 'https://datadog.company.com/apm/service/payment-gateway'
  },
  {
    id: 'mon-3',
    application_id: 'app-3',
    grafana_url: 'https://grafana.company.com/d/notification-service',
    datadog_url: 'https://datadog.company.com/apm/service/notification-service'
  }
];

const initialRoadmap: Roadmap[] = [
  { id: 'road-1', application_id: 'app-2', atividade: 'Integração com adquirente Stone API', trimestre: 'Q1', ano: 2026, status: 'Done' },
  { id: 'road-2', application_id: 'app-2', atividade: 'Upgrade de Segurança PCI-DSS Compliance', trimestre: 'Q2', ano: 2026, status: 'In Progress' },
  { id: 'road-3', application_id: 'app-2', atividade: 'Suporte a pagamentos instantâneos via Pix Pix2Pix', trimestre: 'Q3', ano: 2026, status: 'Backlog' },
  { id: 'road-4', application_id: 'app-1', atividade: 'Redesenho de acessibilidade WCAG 2.1', trimestre: 'Q1', ano: 2026, status: 'Done' },
  { id: 'road-5', application_id: 'app-1', atividade: 'Implementação de Login Social (Google/Apple)', trimestre: 'Q2', ano: 2026, status: 'In Progress' },
  { id: 'road-6', application_id: 'app-3', atividade: 'Integração com WhatsApp Business API', trimestre: 'Q3', ano: 2026, status: 'Backlog' },
  { id: 'road-7', application_id: 'app-3', atividade: 'Otimização de consumo e envio em lote', trimestre: 'Q4', ano: 2026, status: 'Backlog' }
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
  setRoadmap: (val: Roadmap[]) => setStorageItem('roadmap', val)
};
