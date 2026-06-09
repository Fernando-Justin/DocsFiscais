"use client";

import React from 'react';
import Link from 'next/link';
import { Rocket, Layers, Calendar, Users, UserCheck, Cpu, BookOpen, Activity, ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-2.5 border-b shrink-0"
        style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded flex items-center justify-center" style={{ width: 30, height: 30, backgroundColor: 'var(--blue-primary)' }}>
              <Rocket size={16} color="white" />
            </div>
            <div>
              <div className="font-medium text-sm leading-none" style={{ color: 'var(--text-primary)' }}>
                Gestão de Aplicação
              </div>
              <div className="text-[10px] leading-none mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Gerenciador de Aplicações
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="px-6 py-2 border-b text-[12px]" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>
          ← Voltar para Aplicações
        </Link>
        <span className="mx-2" style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--blue-primary)' }}>Sobre</span>
      </div>

      {/* Conteúdo */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Título */}
          <div>
            <h1 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Sobre o Gestão de Aplicação</h1>
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              Sistema de apoio para gerenciamento de aplicações em ambientes de produção e homologação.
            </p>
          </div>

          {/* Cards de Funcionalidades */}
          <div className="grid gap-4">
            {[
              {
                icon: <Layers size={18} />,
                title: 'Visão Geral (Dashboard)',
                desc: 'Exibe estatísticas consolidadas da aplicação: total de endpoints, submódulos, colaboradores, clientes, ocorrências e itens do roadmap. Acesso rápido aos ambientes HML e PRD.'
              },
              {
                icon: <Calendar size={18} />,
                title: 'Roadmap',
                desc: 'Planejamento trimestral de entregas. Permite cadastrar atividades com categoria, prioridade, datas previstas, responsável e status (Backlog, Em andamento, Concluído, Bloqueado).'
              },
              {
                icon: <Users size={18} />,
                title: 'Equipe',
                desc: 'Gestão de colaboradores do ecossistema. É possível associar/dissociar membros às aplicações, definir squad, papel, nível de acesso e status.'
              },
              {
                icon: <UserCheck size={18} />,
                title: 'Clientes',
                desc: 'Cadastro de clientes/áreas de negócio consumidoras da aplicação. Vínculo com endpoints específicos e registro de atividades com status e prazos.'
              },
              {
                icon: <Cpu size={18} />,
                title: 'Stack',
                desc: 'Registro da stack tecnológica: linguagens, frameworks, bancos de dados, ferramentas de observabilidade com versão, categoria e status (Ativo, Em atualização, Obsoleto).'
              },
              {
                icon: <BookOpen size={18} />,
                title: 'Documentação',
                desc: 'Organização de submódulos, endpoints REST (método, path, payload, cURL) e referências do Confluence com categorias como Arquitetura, Runbook e ADR.'
              },
              {
                icon: <Activity size={18} />,
                title: 'Monitoramento',
                desc: 'Registro de ocorrências/incidentes com tipo, ambiente, ofensor, ações tomadas e tempo de impacto. Configuração de links para Grafana, Datadog e outras ferramentas de observabilidade.'
              }
            ].map(feature => (
              <div key={feature.title} className="rounded-lg border p-4 flex items-start gap-3"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="rounded-lg p-2 shrink-0" style={{ backgroundColor: 'var(--blue-light)', color: 'var(--blue-primary)' }}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-[13px] font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Seção de uso */}
          <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="text-[13px] font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Como usar</h2>
            <ol className="list-decimal list-inside space-y-1.5 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
              <li>Na barra lateral, pesquise ou selecione uma aplicação para visualizar seus detalhes.</li>
              <li>Navegue entre as abas (Visão Geral, Roadmap, Equipe, Clientes, Stack, Documentação, Monitoramento) para acessar cada funcionalidade.</li>
              <li>Utilize o botão <strong>+</strong> ao lado da pesquisa para cadastrar uma nova aplicação.</li>
              <li>Os dados são persistidos automaticamente no navegador (modo local) ou no PostgreSQL (com Supabase configurado).</li>
              <li>Alterne o tema entre claro e escuro pelo botão no canto superior direito.</li>
            </ol>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t text-center text-[12px]" style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
        By Justin
      </footer>
    </div>
  );
}
