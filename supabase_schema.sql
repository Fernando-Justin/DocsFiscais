-- Habilitar a extensão UUID-OSSP se não estiver habilitada
create extension if not exists "uuid-ossp";

-- 1. Applications
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  proposito text,
  escopo text,
  ambiente_hml text,
  ambiente_prd text,
  link_confluence text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SubModules
create table if not exists submodules (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade not null,
  nome text not null,
  proposito text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Endpoints (with new fields: parameters, response, auth, status, environment)
create table if not exists endpoints (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade not null,
  submodule_id uuid references submodules(id) on delete set null,
  metodo text not null,
  path text not null,
  descricao text,
  parametros text,
  payload_exemplo text,
  exemplo_response text,
  status_codes text,
  auth_exigida boolean default false,
  auth_tipo text,
  ambiente_disponivel text default 'Ambos',
  status text default 'Ativo',
  comando_curl text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Collaborators (with new fields: status, contato, nivel_acesso)
create table if not exists collaborators (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  squad text not null,
  papel text not null,
  email text not null,
  contato text,
  status text not null default 'Ativo',
  nivel_acesso text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela Associativa Application x Collaborator
create table if not exists application_collaborators (
  application_id uuid references applications(id) on delete cascade not null,
  collaborator_id uuid references collaborators(id) on delete cascade not null,
  primary key (application_id, collaborator_id)
);

-- 5. Monitoring (with nested links support)
create table if not exists monitoring (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade unique not null,
  grafana_url text,
  datadog_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Monitoring Links (individual monitoring system entries)
create table if not exists monitoring_links (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade not null,
  nome text not null,
  url text not null,
  descricao text,
  responsavel text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Roadmap (with new fields: categoria, prioridade, data_inicio, responsavel, observacoes)
create table if not exists roadmap (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade not null,
  atividade text not null,
  detalhamento text,
  categoria text not null default 'Evolução técnica',
  prioridade text not null default 'Média',
  data_prevista_inicio date,
  data_prevista_finalizacao date,
  trimestre text not null,
  ano integer not null,
  status text not null default 'Backlog',
  responsavel text,
  observacoes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Stack (with expanded categories)
create table if not exists stacks (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade not null,
  nome text not null,
  versao text not null default '',
  categoria text not null,
  status text not null default 'Ativo',
  observacao text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Clientes (with nome_empresa and JSONB endpoints array)
create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade not null,
  nome_empresa text,
  area_referencia text not null,
  contato text not null,
  status text not null default 'Ativo',
  endpoints jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Atividades dos Clientes
create table if not exists cliente_atividades (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id) on delete cascade not null,
  descritivo text not null,
  status text not null default 'Pendente',
  data_prevista_inicio date,
  data_prevista_conclusao date,
  observacao text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Ocorrências / Incidentes (new)
create table if not exists ocorrencias (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade not null,
  titulo text not null,
  tipo text not null,
  ambiente text not null,
  ofensor text not null,
  ofensor_outro text,
  data_hora_inicio timestamp with time zone not null,
  data_hora_normalizacao timestamp with time zone,
  tempo_total_minutos integer,
  status text not null default 'Em andamento',
  acoes_tomadas text,
  observacoes text,
  registrado_por text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Confluence References (new)
create table if not exists confluence_references (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade not null,
  titulo text not null,
  url text not null,
  categoria text not null,
  descricao text,
  ultima_atualizacao date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
