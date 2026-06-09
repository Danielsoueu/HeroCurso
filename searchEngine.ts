import { Module } from './types';
import { financeiroModules, renovacaoModules } from './data';

export interface SearchSuggestion {
  moduleId: number;
  courseId: 'financeiro' | 'renovacao';
  courseTitle: string;
  title: string;
  category: string;
  duration: string;
  snippet: string;
  matchType: 'title' | 'category' | 'keyword' | 'description';
}

const moduleDescriptionsMap: Record<string, string> = {
  "financeiro_1": "Identidade visual, Tom de Voz, Jeito Hero de cobrar com empatia, escuta ativa e transparência.",
  "financeiro_2": "Entenda toda a cadeia de produtos da Hero: endereço fiscal, societário, marcas e certificados.",
  "financeiro_3": "Como funcionam os faturamentos, conciliação de faturas, notas fiscais, Iugu e fluxo de caixa.",
  "financeiro_4": "Entenda a régua de cobrança em atraso, interações no Serasa, notificações por Treble e WhatsApp.",
  "financeiro_5": "Principais métricas da operação: MRR, Churn Financeiro, ARR, Cohorts e LTV de carteira.",
  "financeiro_6": "Procedimentos operacionais manuais, estornos na Iugu, cancelamentos e prorrogações de prazos.",
  "financeiro_7": "Playbook prático de objeções com scripts reais de retenção e contorno de problemas.",
  "financeiro_8": "FAQ oficial de atendimento e retenção contra cancelamentos em massa, termos e regras de rescisão.",
  "renovacao_1": "A operação no HubSpot, funil de tickets, etapas automatizadas do Pipe de Renovação e dashboard.",
  "renovacao_2": "A régua automatizada de comunicação de renovação (e-mail, WhatsApp e cupons especiais).",
  "renovacao_3": "Como lidar com solicitações de cancelamento, formulário de retenção e análise de motivos.",
  "renovacao_4": "Processos manuais de contato, uso da telefonia integrada 3C+, ligações de feedback e discador.",
  "renovacao_5": "Gestão e configuração de templates HSM e fluxos de conversa automatizados no Treble.",
  "renovacao_6": "Como realizar envios de e-mails em lote personalizados com Mail Merge e integração Sheets.",
  "renovacao_7": "Enriquecimento de dados cadastrais e busca de lotes (CPF/CNPJ) via módulo Big Data."
};

const moduleKeywords: Record<string, string[]> = {
  "financeiro_1": ["identidade", "tom de voz", "comunicação", "empático", "parceiro", "jeito hero", "escuta ativa", "cordialidade", "valores", "diretrizes", "prático", "otimista", "fácil", "transparente", "entusiasmado"],
  "financeiro_2": ["ecossistema", "produtos", "soluções", "certificados", "endereço fiscal", "marcas", "societário", "escritórios", "valores", "contabilidade", "advocatus"],
  "financeiro_3": ["rotinas financeiras", "conciliação", "faturamento", "nf", "nota fiscal", "iugu", "gateway", "boleto", "cartão de crédito", "pix", "adquirentes"],
  "financeiro_4": ["inadimplência", "serasa", "cobrança", "atraso", "negativação", "aviso", "régua", "sms", "treble", "whatsapp", "e-mail", "protesto"],
  "financeiro_5": ["mapeamento operacional", "fluxo de caixa", "mrr", "churn", "arr", "cohort", "ltv", "cac", "métricas", "comissão", "perdas"],
  "financeiro_6": ["operações especiais", "estorno", "reembolso", "manual", "prorrogação", "desconto", "iugu", "isenção", "cancelamento manual", "ajuste"],
  "financeiro_7": ["playbook", "situações críticas", "atendimento", "objeções", "sem juros", "boleto recorrente", "suporte", "ajuda", "desconto", "renegociação", "atrasado"],
  "financeiro_8": ["faq", "perguntas", "cancelamento", "reajuste", "termo", "contrato", "rescisão", "multa", "cobrança indevida", "retenção"],
  "renovacao_1": ["hubspot", "pipeline", "funil", "tickets", "etapas", "oportunidades", "dashboard", "pipe", "ticket", "relatório", "automação", "faturamento", "diretrizes"],
  "renovacao_2": ["régua de comunicação", "comunicação", "whatsapp", "e-mail", "cupom", "desconto", "promocional", "hsm", "disparo", "templates", "mensagens", "renegociação"],
  "renovacao_3": ["cancelamento", "solicitação", "formulário", "retenção", "estorno", "rescindir", "multa", "distrato", "encerramento de empresa"],
  "renovacao_4": ["processos manuais", "3c+", "telefonia", "discador", "tarefas", "ligação", "feedback", "ligar", "atendimento", "chamada"],
  "renovacao_5": ["treble", "whatsapp", "template", "hsm", "chatbot", "fluxos", "ativação", "inbound", "mensagem"],
  "renovacao_6": ["mail merge", "e-mail", "planilha", "sheets", "personalização", "assunto", "envio em lote", "tags", "cabeçalho", "campos", "gmail"],
  "renovacao_7": ["big data", "enriquecimento", "consulta", "lote", "cpf", "cnpj", "cadastro", "cruzamento", "higienização", "base", "planilha"]
};

export function searchAllModules(query: string): SearchSuggestion[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (normalizedQuery.length < 2) return [];

  const results: SearchSuggestion[] = [];

  const processModule = (mod: Module, courseId: 'financeiro' | 'renovacao', courseTitle: string) => {
    const key = `${courseId}_${mod.id}`;
    const desc = moduleDescriptionsMap[key] || mod.description || '';
    const keywords = moduleKeywords[key] || [];

    const isTitleMatch = mod.title.toLowerCase().includes(normalizedQuery);
    const isCategoryMatch = mod.category?.toLowerCase().includes(normalizedQuery);
    const isDescMatch = desc.toLowerCase().includes(normalizedQuery);
    const matchedKeywords = keywords.filter(k => k.toLowerCase().includes(normalizedQuery));

    if (isTitleMatch || isCategoryMatch || isDescMatch || matchedKeywords.length > 0) {
      let matchType: 'title' | 'category' | 'description' | 'keyword' = 'keyword';
      if (isTitleMatch) matchType = 'title';
      else if (isCategoryMatch) matchType = 'category';
      else if (isDescMatch) matchType = 'description';

      results.push({
        moduleId: mod.id,
        courseId,
        courseTitle,
        title: mod.title,
        category: mod.category || '',
        duration: mod.duration,
        snippet: desc,
        matchType
      });
    }
  };

  // Search through Financeiro Modules
  financeiroModules.forEach(mod => processModule(mod, 'financeiro', 'Financeiro e Inadimplência'));

  // Search through Renovação Modules
  renovacaoModules.forEach(mod => processModule(mod, 'renovacao', 'Renovações e Churn'));

  return results;
}
