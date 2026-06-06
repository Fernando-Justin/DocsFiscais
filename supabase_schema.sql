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

-- 3. Endpoints
create table if not exists endpoints (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade not null,
  submodule_id uuid references submodules(id) on delete set null,
  metodo text not null, -- GET, POST, PUT, DELETE, PATCH, etc.
  path text not null,
  descricao text,
  payload_exemplo text, -- Armazenado como string JSON
  comando_curl text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Collaborators
create table if not exists collaborators (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  squad text not null,
  papel text not null, -- mantenedor/dev
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela Associativa Application x Collaborator
create table if not exists application_collaborators (
  application_id uuid references applications(id) on delete cascade not null,
  collaborator_id uuid references collaborators(id) on delete cascade not null,
  primary key (application_id, collaborator_id)
);

-- 5. Monitoring
create table if not exists monitoring (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade unique not null,
  grafana_url text,
  datadog_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Roadmap
create table if not exists roadmap (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade not null,
  atividade text not null,
  trimestre text not null, -- Q1, Q2, Q3, Q4
  ano integer not null,
  status text not null, -- Backlog, In Progress, Done
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
