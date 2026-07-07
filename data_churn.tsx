import React from 'react';
import { Module } from './types';
import { 
  Compass, Users, Clock, Search, Wrench, Shuffle, Target, 
  ClipboardList, Leaf, RefreshCw, MessageSquare, CheckSquare 
} from 'lucide-react';

export const churnModules: Module[] = [
  {
    id: 1,
    title: "1. Introdução",
    category: "INTRODUÇÃO",
    icon: <Compass className="w-5 h-5" />,
    duration: "10 min",
    content: (
      <div className="space-y-6">
        <p className="text-gray-600 text-sm">
          Este módulo apresenta o papel da área de Retenção dentro da Company Hero, cobrindo suas duas frentes de atuação — Retenção Reativa e Recuperação de Inadimplência — e os indicadores que orientam o trabalho do time.
        </p>

        <h3 className="font-bold text-lg text-gray-900">1. Objetivo da Área</h3>
        <p className="text-gray-600 text-sm">
          A área de Retenção atua sobre dois momentos distintos da jornada do cliente: quando ele já solicitou o cancelamento (Retenção Reativa) e quando ele ainda não pediu, mas está em risco por inadimplência (Recuperação de Inadimplência / Churn Preditivo).
        </p>
        
        <p className="text-gray-600 text-sm">Em ambos os casos, os quatro focos são os mesmos:</p>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
          <li>Redução de churn;</li>
          <li>Reversão de cancelamentos;</li>
          <li>Manutenção de receita;</li>
          <li>Melhoria da experiência do cliente.</li>
        </ul>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <p className="text-yellow-800 text-sm">
            📌 <strong>Ponto-chave:</strong> o objetivo não é "convencer o cliente a ficar" a qualquer custo — é entender o motivo real por trás do risco de saída e agir sobre ele.
          </p>
        </div>

        <h3 className="font-bold text-lg text-gray-900 mt-6">🔀 Duas Frentes de Atuação</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-collapse border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 font-semibold border-b border-gray-200">Frente</th>
                <th className="p-3 font-semibold border-b border-gray-200">Quando atua</th>
                <th className="p-3 font-semibold border-b border-gray-200">Gatilho de entrada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-white">
                <td className="p-3 font-medium text-gray-800">Retenção Reativa</td>
                <td className="p-3 text-gray-600">Depois que o cliente já pediu para cancelar</td>
                <td className="p-3 text-gray-600">Solicitação via Renovação, Suporte ou Cobrança</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-medium text-gray-800">Recuperação de Inadimplência</td>
                <td className="p-3 text-gray-600">Antes da suspensão, de forma proativa</td>
                <td className="p-3 text-gray-600">90 dias de atraso → etapa de suspensão</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-bold text-lg text-gray-900 mt-6">📊 Indicadores Esperados</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2"><span>📉</span> Redução do churn</li>
          <li className="flex items-center gap-2"><span>📈</span> Aumento da retenção</li>
          <li className="flex items-center gap-2"><span>😊</span> Melhoria da experiência do cliente</li>
          <li className="flex items-center gap-2"><span>💰</span> Maior previsibilidade de receita</li>
          <li className="flex items-center gap-2"><span>🚀</span> Evolução contínua dos processos</li>
        </ul>
      </div>
    )
  },
  {
    id: 2,
    title: "2. Retenção Reativa",
    category: "RETENÇÃO REATIVA",
    icon: <Users className="w-5 h-5" />,
    duration: "85 min",
    content: (
      <div className="space-y-8">
        <p className="text-gray-600 text-sm">
          Este módulo agrupa as responsabilidades, origens de solicitações, fluxo de entrada e SLA, bem como análise, fluxo operacional, cenários de cancelamento e estratégias de retenção.
        </p>

        {/* SECTION 1: Responsabilidades e Origem */}
        <hr className="border-gray-200" />
        <h3 className="font-bold text-lg text-gray-900">1. Responsabilidades e Origem</h3>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 bg-white p-6 border border-gray-200 rounded-xl mb-6">
          <li>Entrar em contato com clientes que solicitaram cancelamento;</li>
          <li>Entender o motivo real da solicitação;</li>
          <li>Avaliar a possibilidade de retenção;</li>
          <li>Negociar alternativas dentro da política interna;</li>
          <li>Atualizar corretamente o pipeline;</li>
          <li>Registrar todas as interações no ticket;</li>
          <li>Atuar dentro do SLA estabelecido.</li>
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm text-center">
             <div className="text-2xl mb-2">🔄</div>
             <h4 className="font-bold text-gray-800">Renovação</h4>
             <p className="text-xs text-gray-600 mt-2">Clientes abordados no período de renovação anual que demonstram intenção de cancelar.</p>
          </div>
          <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm text-center">
             <div className="text-2xl mb-2">🛠️</div>
             <h4 className="font-bold text-gray-800">Suporte</h4>
             <p className="text-xs text-gray-600 mt-2">Clientes que entram em contato solicitando cancelamento diretamente.</p>
          </div>
          <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm text-center">
             <div className="text-2xl mb-2">💰</div>
             <h4 className="font-bold text-gray-800">Cobrança</h4>
             <p className="text-xs text-gray-600 mt-2">Clientes inadimplentes que solicitam cancelamento durante um contato financeiro.</p>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-red-800 text-sm font-medium mt-0.5">
            Atenção: todas as solicitações devem ser abertas via formulário interno, para evitar tickets duplicados pelo ID da assinatura.
          </p>
        </div>

        {/* SECTION 2: Fluxo de Entrada e SLA */}
        <hr className="border-gray-200" />
        <h3 className="font-bold text-lg text-gray-900">2. Fluxo de Entrada e SLA</h3>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-center mb-4">
          <p className="text-sm font-medium text-slate-700 text-center">
            <span className="text-hero-600">Formulário interno</span> → Ticket criado automaticamente → Entra no pipeline de Retenção → Time inicia a análise
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3 mb-6">
          <span className="text-2xl">⏰</span>
          <p className="text-blue-900 text-sm font-bold">
            SLA: até 2 dias úteis a partir da entrada do ticket no pipeline.
          </p>
        </div>

        {/* SECTION 3: Análise Inicial */}
        <hr className="border-gray-200" />
        <h3 className="font-bold text-lg text-gray-900">3. Análise Inicial e Elegibilidade</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
              <span className="text-xl">✅</span> Cliente Elegível
            </h4>
            <ul className="space-y-2 text-sm text-green-800 mb-6">
              <li>• Possui CNPJ ativo</li>
              <li>• Ainda utiliza o endereço da Company</li>
            </ul>
            <div className="pt-4 border-t border-green-200">
              <span className="font-bold text-green-900">Ação: seguir para contato e negociação</span>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-bold text-red-900 mb-4 flex items-center gap-2">
              <span className="text-xl">❌</span> Cliente Não Elegível
            </h4>
            <ul className="space-y-2 text-sm text-red-800 mb-6">
              <li>• Já alterou o endereço</li>
              <li>• Deu baixa no CNPJ</li>
              <li>• Migrou para endereço próprio</li>
            </ul>
            <div className="pt-4 border-t border-red-200">
              <span className="font-bold text-red-900">Ação: cancelamento sem negociação</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: Fluxo Operacional */}
        <hr className="border-gray-200" />
        <h3 className="font-bold text-lg text-gray-900">4. Fluxo Operacional Passo a Passo</h3>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-bold text-slate-800 mb-2">Passo 1: Abrir o ticket e localizar o cliente (IUGU)</p>
            <video autoPlay loop muted playsInline controls src="/media/abrindo_ticket.mp4" className="rounded-lg border border-gray-200 w-full mb-2" />
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-bold text-slate-800 mb-2">Passo 2: Validar o CNPJ na Receita Federal</p>
            <video autoPlay loop muted playsInline controls src="/media/validando_cnpj.mp4" className="rounded-lg border border-gray-200 w-full mb-2" />
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-bold text-slate-800 mb-2">Passo 3: Confirmar se o endereço é da Hero (Notion)</p>
            <video autoPlay loop muted playsInline controls src="/media/validando_endereco.mp4" className="rounded-lg border border-gray-200 w-full mb-2" />
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-bold text-slate-800 mb-2">Passo 4: Cliente só com CPF (BigData Corp)</p>
            <video autoPlay loop muted playsInline controls src="/media/bigdata.mp4" className="rounded-lg border border-gray-200 w-full mb-2" />
          </div>
        </div>

        {/* SECTION 5: Cenários de Cancelamento */}
        <hr className="border-gray-200" />
        <h3 className="font-bold text-lg text-gray-900">5. Cenários de Cancelamento</h3>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Cenário 1 — Cancelamento Sem Negociação:</h4>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2 mb-4">
            <li>Cancelar a assinatura na IUGU;</li>
            <li>Cancelar o contrato na Wagtail;</li>
            <li>Cancelar também no HeroOS;</li>
            <li>Formalizar o cancelamento ao cliente;</li>
            <li>Atualizar e encerrar o ticket com status "Cancelamento sem negociação".</li>
          </ol>
          <video autoPlay loop muted playsInline controls src="/media/formalizando.mp4" className="rounded-lg border border-gray-200 w-full mb-4" />
        </div>

        <div className="mb-6">
          <h4 className="font-bold text-md text-gray-900 mb-4">Cenário 2 — Cliente Elegível: Diagnóstico e Negociação</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
              <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2"><span className="text-xl">🏢</span> Baixa futura do CNPJ</h4>
              <p className="text-xs text-gray-600">Cliente ainda usa o endereço, mas pretende encerrar a empresa.</p>
            </div>
            <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
              <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2"><span className="text-xl">📍</span> Alteração futura de endereço</h4>
              <p className="text-xs text-gray-600">Cliente pretende migrar para endereço físico.</p>
            </div>
          </div>
        </div>

        {/* SECTION 6: Estratégias */}
        <hr className="border-gray-200" />
        <h3 className="font-bold text-lg text-gray-900">6. Estratégias de Retenção</h3>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 font-semibold border-b">Estratégia</th>
                <th className="p-4 font-semibold border-b">Quando aplicar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="p-4 font-medium">🔄 Migração de plano</td><td className="p-4 text-gray-600">Cliente anual → oferecer plano mensal</td></tr>
              <tr><td className="p-4 font-medium">🔄 Migração de endereço</td><td className="p-4 text-gray-600">Oferecer outro endereço fiscal Hero</td></tr>
              <tr><td className="p-4 font-medium">💲 Desconto em mensalidade</td><td className="p-4 text-gray-600">Desconto temporário conforme política. Acima de 30% → alinhar com a Kat</td></tr>
              <tr><td className="p-4 font-medium">🏢 Migração para MEV</td><td className="p-4 text-gray-600">Cliente Company Hero migra para MEV + cupom de desconto</td></tr>
              <tr><td className="p-4 font-medium">🎁 Benefícios extras</td><td className="p-4 text-gray-600">Isenção temporária, restart de onboarding, suporte prioritário — mediante autorização da Kat</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "3. Gestão e Casos Especiais",
    category: "GESTÃO",
    icon: <ClipboardList className="w-5 h-5" />,
    duration: "27 min",
    content: (
      <div className="space-y-8">
        <p className="text-gray-600 text-sm">
          Como manter o ticket organizado e o ritmo de contato com o cliente, do dia da abertura até a última tentativa, além de lidar com clientes em início de jornada.
        </p>

        {/* SECTION 1: Pipeline */}
        <h3 className="font-bold text-lg text-gray-900 mb-4">1. Etapas do Pipeline</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { t: "Solicitação Recebida", d: "Entrada inicial de todos os tickets", c: "bg-blue-100 text-blue-800" },
            { t: "Cancelamento Sem Negociação", d: "Casos sem possibilidade de retenção", c: "bg-gray-200 text-gray-700" },
            { t: "Aguardando Documentação", d: "Comprovantes de baixa/alteração de endereço", c: "bg-yellow-100 text-yellow-800" },
            { t: "Aguardando Retorno do Cliente", d: "Depende de resposta do cliente", c: "bg-orange-100 text-orange-800" },
            { t: "Em Tratativa", d: "Depende de alinhamento interno", c: "bg-purple-100 text-purple-800" }
          ].map((st, i) => (
            <div key={i} className="w-full md:w-[calc(50%-0.5rem)] bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <span className={`text-xs font-bold px-2 py-1 rounded ${st.c}`}>{st.t}</span>
              <p className="text-sm text-gray-600 mt-3">{st.d}</p>
            </div>
          ))}
        </div>

        {/* SECTION 2: Régua */}
        <h3 className="font-bold text-lg text-gray-900 mb-4">2. Régua de Comunicação</h3>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 font-semibold border-b">Dia</th>
                <th className="p-4 font-semibold border-b">Canal</th>
                <th className="p-4 font-semibold border-b">Objetivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="p-4 font-bold text-gray-800">D0 — Abertura</td><td className="p-4">📧 E-mail</td><td className="p-4 text-gray-600">Confirmar recebimento, entender motivo, iniciar negociação</td></tr>
              <tr><td className="p-4 font-bold text-gray-800">D2 — 2ª tentativa</td><td className="p-4">📱 WhatsApp + ligação (tarde)</td><td className="p-4 text-gray-600">Reforçar contato por canal direto</td></tr>
              <tr><td className="p-4 font-bold text-gray-800">D3 — Follow-up</td><td className="p-4">📧 E-mail</td><td className="p-4 text-gray-600">Reforçar necessidade de retorno</td></tr>
              <tr><td className="p-4 font-bold text-gray-800">D4 — Última</td><td className="p-4">📱 WhatsApp + ligação</td><td className="p-4 text-gray-600">Última tentativa antes do fluxo interno</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-gradient-to-r from-hero-50 to-pink-50 border border-hero-100 p-6 rounded-xl relative overflow-hidden mb-6">
          <div className="absolute right-0 top-0 w-32 h-32 bg-hero-500 rounded-full blur-3xl opacity-10 -mr-10 -mt-10"></div>
          <h4 className="font-bold text-hero-900 mb-2 flex items-center gap-2 relative z-10">
            <span className="text-xl">⚡</span> A REGRA DE OURO
          </h4>
          <p className="text-sm text-hero-800 leading-relaxed relative z-10">
            Se, em qualquer interação da jornada de Cobrança ou Recuperação, o cliente verbalizar o desejo de cancelar, <strong>o fluxo automatizado daquela régua deve ser pausado imediatamente</strong> e transferido para a Retenção Reativa.
          </p>
        </div>

        {/* SECTION 3: Casos Especiais */}
        <hr className="border-gray-200" />
        <h3 className="font-bold text-lg text-gray-900 mt-6 mb-4">3. Cancelamentos em Início de Jornada</h3>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Possíveis causas</span>
            <p className="text-sm text-gray-800">Falha no onboarding, dificuldade de vinculação do endereço, falta de entendimento do processo, expectativa desalinhada.</p>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Estratégia</span>
            <p className="text-sm text-gray-800 font-medium">Diagnóstico detalhado → identificar o ponto de bloqueio → registrar a causa real.</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <span className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-1">Possíveis soluções</span>
            <p className="text-sm text-green-900">Restart de onboarding, suporte assistido, isenção, acompanhamento próximo, orientação passo a passo.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "4. Recuperação de Inadimplência",
    category: "RECUPERAÇÃO DE INADIMPLÊNCIA (CHURN PREDITIVO)",
    icon: <Target className="w-5 h-5" />,
    duration: "40 min",
    content: (
      <div className="space-y-8">
        <p className="text-gray-600 text-sm">
          Diferente da Retenção Reativa, aqui o time age antes que o cliente peça para cancelar — a partir de um sinal de risco: o atraso no pagamento.
        </p>

        {/* Visão Geral */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4">1. Objetivo</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2"><span className="text-hero-500 font-bold">•</span> Reduzir o churn por inadimplência;</li>
              <li className="flex items-center gap-2"><span className="text-hero-500 font-bold">•</span> Aumentar a taxa de conversão;</li>
              <li className="flex items-center gap-2"><span className="text-hero-500 font-bold">•</span> Atuar de forma proativa antes da suspensão.</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4">2. Público e Gatilho</h3>
            <p className="text-sm text-gray-700 mb-2"><strong>Quem entra:</strong> clientes com até 3 faturas pendentes ou faturas antigas em aberto.</p>
            <p className="text-sm text-gray-700 mb-4"><strong>Gatilho:</strong> entrada na etapa de suspensão (planilha de inadimplência).</p>
            
            <div className="bg-red-50 text-red-800 p-3 rounded-lg border border-red-100 font-medium text-sm text-center">
              ⏱️ Critério mínimo de entrada: 90 dias de atraso.
            </div>
          </div>
        </div>

        {/* Fluxo */}
        <hr className="my-8 border-gray-200" />
        
        <h3 className="font-bold text-lg text-gray-900">3. Fluxo do Processo de Recuperação</h3>
        
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
          <table className="min-w-full text-sm text-left">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-4 font-bold text-gray-900 w-1/4">1. Identificação</td>
                <td className="p-4 text-gray-700">Cliente atingiu 90 dias de atraso e está na etapa de suspensão.</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-gray-900">2. Contato</td>
                <td className="p-4 text-gray-700">WhatsApp, telefone ou e-mail — abordagem de apoio, nunca de cobrança.</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-gray-900">3. Negociação</td>
                <td className="p-4 text-gray-700">Pagamento à vista com isenção de juros/multa · Parcelamento em até 2x · Ajuste de plano.</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-gray-900">4. Acompanhamento</td>
                <td className="p-4 text-gray-700">Follow-up e registro de todas as tentativas.</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-gray-900">5. Finalização</td>
                <td className="p-4 text-gray-700">Pagou → registrar no HubSpot. Não pagou → manter histórico atualizado.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ferramentas */}
        <hr className="my-8 border-gray-200" />
        
        <h3 className="font-bold text-lg text-gray-900 mb-4">4. Ferramentas, Comunicação e Métricas</h3>
        <div>
          <h4 className="font-bold text-md text-gray-900 mb-4">Ferramentas</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-center">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Consulta</h4>
              <p className="text-sm font-medium text-gray-800">Iugu, Hero OS, Vindi</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-center">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contato</h4>
              <p className="text-sm font-medium text-gray-800">Treble, 3C, E-mail</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-center">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registro</h4>
              <p className="text-sm font-medium text-gray-800">Planilha de inadimplência, HubSpot (apenas conversão)</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-md text-gray-900 mb-4 mt-6">💬 Scripts de Referência</h4>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">📞 Abordagem inicial</h4>
              <p className="text-sm text-blue-800 italic">"Olá, tudo bem? Aqui é da equipe da Company Hero. Identificamos algumas mensalidades em aberto e quisemos te ajudar antes de qualquer suspensão. Podemos te apoiar nisso agora?"</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "5. Prática e Checklists",
    category: "PRÁTICA",
    icon: <CheckSquare className="w-5 h-5" />,
    duration: "8 min",
    content: (
      <div className="space-y-8">
        <p className="text-gray-600 text-sm">
          Consulta rápida para revisar um caso antes de encerrar ou escalar, e o significado de cada termo/ferramenta citado na trilha.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-hero-500">✅</span> Checklist — Retenção Reativa
            </h3>
            <div className="space-y-3">
              {[
                "Ticket aberto via formulário interno (sem duplicidade)?",
                "Cliente localizado no gateway (IUGU)?",
                "CNPJ validado na Receita Federal?",
                "Endereço confirmado como Hero (Notion)?",
                "Elegibilidade definida?",
                "Régua D0–D4 respeitada?",
                "Interações registradas no ticket?",
                "Pipeline atualizado na etapa correta?"
              ].map((item, idx) => (
                <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 border-gray-300 rounded text-hero-500 focus:ring-hero-500 w-4 h-4 cursor-pointer" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-hero-500">✅</span> Checklist — Recuperação
            </h3>
            <div className="space-y-3">
              {[
                "Cliente com 90+ dias e na etapa de suspensão?",
                "Abordagem de apoio (não de cobrança)?",
                "Opções de negociação oferecidas?",
                "Follow-up e tentativas registradas?",
                "Planilha e HubSpot atualizados?"
              ].map((item, idx) => (
                <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 border-gray-300 rounded text-hero-500 focus:ring-hero-500 w-4 h-4 cursor-pointer" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">📖 Glossário</h3>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4 font-semibold border-b">Termo</th>
                  <th className="p-4 font-semibold border-b">O que é</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="p-4 font-bold text-gray-800">Churn</td><td className="p-4 text-gray-600">Perda de clientes / cancelamento de assinaturas</td></tr>
                <tr><td className="p-4 font-bold text-gray-800">Churn Preditivo</td><td className="p-4 text-gray-600">Recuperação de Inadimplência — agir antes da suspensão</td></tr>
                <tr><td className="p-4 font-bold text-gray-800">IUGU</td><td className="p-4 text-gray-600">Gateway de pagamento</td></tr>
                <tr><td className="p-4 font-bold text-gray-800">Wagtail</td><td className="p-4 text-gray-600">Sistema de contratos</td></tr>
                <tr><td className="p-4 font-bold text-gray-800">HeroOS</td><td className="p-4 text-gray-600">Sistema operacional interno da Hero</td></tr>
                <tr><td className="p-4 font-bold text-gray-800">Vindi</td><td className="p-4 text-gray-600">Ferramenta de consulta (inadimplência)</td></tr>
                <tr><td className="p-4 font-bold text-gray-800">Treble / 3C</td><td className="p-4 text-gray-600">Ferramentas de contato (mensageria/discagem)</td></tr>
                <tr><td className="p-4 font-bold text-gray-800">HubSpot</td><td className="p-4 text-gray-600">CRM de registro de conversões</td></tr>
                <tr><td className="p-4 font-bold text-gray-800">MEV</td><td className="p-4 text-gray-600">Produto para o qual clientes podem migrar</td></tr>
                <tr><td className="p-4 font-bold text-gray-800">BigData Corp</td><td className="p-4 text-gray-600">Consulta de CNPJ vinculado a CPF</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
];
