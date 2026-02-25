import React from 'react';
import { 
  Users, Shield, DollarSign, AlertTriangle, FileText, Book, MessageCircle, 
  CheckCircle, ChevronDown, Zap, BarChart3, Lock, Target, ClipboardList,
  MousePointer, Calculator, AlertOctagon, Search, RefreshCw, TrendingDown,
  Lightbulb, HeartHandshake, XOctagon, BrainCircuit, Phone, Calendar, Clock,
  PauseCircle
} from 'lucide-react';
import { Module, FAQCategory, Course } from './types';
import { InfoBox, ScriptCard, ComparisonRow } from './components/ui/Cards';
import { Quiz } from './components/ui/Quiz';

export const courses: Course[] = [
  {
    id: 'financeiro',
    title: "Cobrança & Negociação",
    description: "Domine a arte de recuperar crédito mantendo o relacionamento Hero.",
    icon: <DollarSign className="w-8 h-8" />,
    status: 'active',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'renovacao',
    title: "Renovação & Retenção",
    description: "Estratégias para garantir a continuidade do cliente na base.",
    icon: <RefreshCw className="w-8 h-8" />,
    status: 'construction',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'churn',
    title: "Prevenção de Churn",
    description: "Análise de dados e sinais vitais para evitar cancelamentos.",
    icon: <TrendingDown className="w-8 h-8" />,
    status: 'construction',
    color: 'from-blue-500 to-cyan-500'
  }
];

export const faqs: FAQCategory[] = [
  {
    category: "Valores, Cobranças e Inadimplência",
    items: [
      { q: "Por que o valor mudou? (Quando há reajuste)", a: "O valor do plano contratado é revisto a cada renovação. O reajuste é feito com base no índice do IGPM (FGV) ocorrido no período. Caso o índice do IGPM seja negativo, será adotado o IPCA (IBGE)." },
      { q: "Já vai cobrar agora? É automático?", a: "Sim. Ao final do prazo de vigência, o contrato é automaticamente renovado por igual período, exceto se houver um aviso formal com antecedência mínima de 30 dias. A renovação é feita de forma automática. Para facilitar a transação do novo ciclo, enviamos um link para que você consiga realizar o pagamento dentro do prazo." },
      { q: "O cancelamento é automático se eu parar de pagar?", a: "Não. A falta de pagamento não encerra a assinatura e o contrato segue válido. A inadimplência gera juros, multa e pode levar à negativação do CPF ou CNPJ. Para cancelar, é necessário formalizar a solicitação no e-mail ajuda@companyhero.com e enviar o comprovante de alteração ou baixa do endereço." },
      { q: "Posso continuar usando o endereço mesmo sem pagar?", a: "Se o endereço continuar vinculado ao seu CNPJ sem uma assinatura ativa, haverá risco de desativação do endereço, possível irregularidade no CNPJ caso o endereço seja removido, e cobrança automática de multa e juros, além de negativação financeira." },
      { q: "Quais são as multas e juros por atraso?", a: "Após o primeiro dia de atraso, o contratante deverá pagar juros de 1% ao mês (0,033% ao dia). Para atrasos inferiores a 30 dias, ocorre a aplicação de multa de 3% sobre o valor contratado. Após 30 dias de atraso, a multa é de 10% sobre o valor contratado, com atualização monetária pelo IGPM/FGV." },
      { q: "Quero a segunda via da fatura, onde encontrar?", a: "Seu boleto é enviado 7 dias antes do vencimento para o e-mail cadastrado. Caso o pagamento seja por cartão, a cobrança será lançada no dia do vencimento. As informações também estão disponíveis na área do cliente (https://www.companyhero.com/login) utilizando seu e-mail e senha." },
      { q: "Como negociar meus débitos?", a: "É necessário entrar em contato com nosso time financeiro para avaliar seu caso e negociar o débito pendente." }
    ]
  },
  {
    category: "Contrato e Obrigação de Renovar",
    items: [
      { q: "A renovação é obrigatória?", a: "Não. Porém, o cancelamento só pode ser efetuado se o endereço da Company Hero não estiver mais vinculado ao seu CNPJ na Receita Federal." },
      { q: "Se eu não renovar, o endereço deixa de valer na mesma hora?", a: "Não. Se o endereço seguir em uso e o pagamento não for efetuado, o sistema aplica juros e multa." },
      { q: "Preciso assinar um novo contrato?", a: "Não. O contrato atual permanece válido em caso de renovação." },
      { q: "Posso encerrar o plano antes do vencimento?", a: "Sim. No entanto, a Company Hero reserva-se o direito de não reembolsar planos anuais. Em casos onde a empresa estender flexibilidade, será cobrada uma multa de 10% sobre o valor restante referente ao plano contratado, com os impostos sendo abatidos." }
    ]
  },
  {
    category: "Atualizações e Dados Cadastrais",
    items: [
      { q: "Preciso atualizar meus dados para renovar?", a: "Sim. Se o seu e-mail, telefone ou o responsável financeiro mudaram, é necessário nos informar. Sem um contato válido, podem ocorrer juros e multas por atraso caso você não receba as comunicações." }
    ]
  },
  {
    category: "Cancelamento, Negociação e Retenção",
    items: [
      { q: "Quero cancelar minha assinatura, como faço?", a: "Conforme contrato, o cancelamento deve ser solicitado com 30 dias de antecedência para o e-mail ajuda@companyhero.com, acompanhado obrigatoriamente do comprovante de alteração de endereço ou de baixa do CNPJ. Se for MEI, a alteração pode ser feita pelo portal gov.br." },
      { q: "Cancelei minha assinatura, preciso pagar os débitos pendentes?", a: "Sim. As cobranças continuam devidas até que a Company Hero receba o comprovante de alteração ou baixa do CNPJ, pois o serviço segue ativo e disponível enquanto o endereço estiver vinculado." },
      { q: "Não usei o endereço, tenho direito a reembolso ou estorno?", a: "O reembolso integral é realizado apenas para cancelamentos solicitados em até 7 dias após a contratação original (Código de Defesa do Consumidor). Em planos anuais cancelados antes de 12 meses, não é devido reembolso padrão, já que o serviço esteve ativo e disponível." },
      { q: "Por que estou recebendo cobranças se não estou usando o serviço?", a: "Enquanto o endereço da Company Hero estiver vinculado ao seu CNPJ na Receita Federal, o serviço permanece ativo perante os órgãos públicos e sob nossa responsabilidade. Só podemos seguir com o cancelamento (e a interrupção das cobranças) após o envio do comprovante de desvinculação." }
    ]
  },
  {
    category: "Métodos de Pagamento",
    items: [
      { q: "Quais são as formas de pagamento disponíveis?", a: "Para o plano anual à vista, aceitamos boleto, PIX ou cartão de crédito em pagamento único. Para o plano anual parcelado, aceitamos em até 12x no cartão de crédito." },
      { q: "Posso pagar mensal ao invés de anual?", a: "Sim, porém o desconto aplicado no plano anual não se mantém no plano mensal. Para alterar a forma de pagamento, entre em contato com nosso time financeiro ou suporte." },
      { q: "Posso parcelar por outras formas?", a: "PIX e Boleto podem ser parcelados em até 2x. Cartão de crédito em até 12x (com alteração de valor)." },
      { q: "Quero realizar o pagamento da fatura em boleto, PIX ou cartão. Como faço?", a: "Entre em contato com nosso time financeiro ou suporte via chat para que a fatura seja disponibilizada na modalidade desejada." },
      { q: "Posso trocar o cartão agora na renovação?", a: "Sim. O link de pagamento enviado permite que você cadastre um novo cartão." },
      { q: "Como atualizar meu cartão de crédito fora da renovação?", a: "Entre em contato com o time financeiro ou de suporte para que seja enviada uma nova autorização de cadastro, permitindo a atualização no sistema." }
    ]
  },
  {
    category: "Dúvidas Comuns de Clientes de Contadores Parceiros",
    items: [
      { q: "Não era com meu contador? Por que agora é com a Company Hero?", a: "O contador parceiro fez apenas a contratação inicial. A gestão, manutenção e renovação do endereço fiscal sempre foram responsabilidade da Company Hero, que é a proprietária e administradora do endereço. A partir do segundo ano, a renovação é feita diretamente conosco." },
      { q: "O que é exatamente a Company Hero?", a: "Somos a empresa que fornece e administra endereços fiscais e comerciais, garantindo a documentação válida, conformidade jurídica e suporte ao uso do endereço no seu CNPJ." },
      { q: "Esse endereço não é vitalício? Eu já não paguei no primeiro ano?", a: "Não. O endereço fiscal funciona por assinatura anual, como um aluguel. O valor pago no primeiro ano cobria apenas 12 meses de uso." },
      { q: "Por que eu tenho que pagar novamente se é o mesmo endereço?", a: "A assinatura mantém ativos serviços essenciais, como: manutenção jurídica, infraestrutura do endereço, emissão de documentos válidos, uso contínuo do endereço no CNPJ e responsabilidade legal perante órgãos públicos." },
      { q: "Meu contador falou que ficava tudo por conta deles. Eu preciso fazer algo?", a: "A contabilidade da sua empresa continua com o seu contador, mas o endereço fiscal é de responsabilidade da Company Hero. Você só precisa realizar a renovação da assinatura diretamente conosco." },
      { q: "Vocês vão avisar meu contador sobre a renovação?", a: "A renovação é uma tratativa entre você e a Company Hero. Podemos avisar seu contador caso você queira, mas isso não é obrigatório." }
    ]
  },
  {
    category: "Comunicação, Suporte e Dúvidas Adicionais",
    items: [
      { q: "Esse número é da Company Hero mesmo?", a: "Sim. Além do WhatsApp, podemos enviar as informações por e-mail, e sua fatura oficial sempre estará disponível no site e no app PJ Hero." },
      { q: "Quais são os limites para recebimento de correspondências?", a: "O cliente tem direito ao recebimento de até 50 envelopes mensais (medida máxima de 324x229mm) e até 2 caixas mensais (medida máxima de 500x500mm). As correspondências são recebidas apenas em dias úteis, das 09h às 18h." },
      { q: "Vocês escaneiam minhas correspondências?", a: "Serão escaneadas apenas correspondências tipo carta, limitadas a 10 páginas por correspondência. O escaneamento ocorre somente mediante autorização prévia do contratante na plataforma. Não escaneamos pacotes, caixas ou cartões." },
      { q: "Posso cancelar ou reagendar a locação de uma Sala de Reunião?", a: "Sim, os cancelamentos ou reagendamentos podem ser feitos sem custo adicional até 2 (duas) horas antes do horário agendado. Se faltar menos de 2 horas para a reserva, não será possível alterar ou cancelar, e o valor será cobrado integralmente." }
    ]
  }
];

export const quizQuestions = [
  {
    question: "O cliente parou de pagar e abandonou o endereço. O contrato é cancelado automaticamente?",
    options: ["Sim, após 30 dias.", "Não. A responsabilidade é ativa e a cobrança é devida.", "Sim, o sistema baixa.", "Talvez, depende do analista."],
    correctIndex: 1,
    explanation: "O cancelamento não é automático. Sem o comprovante de baixa na Receita, a Hero continua responsável juridicamente pelo endereço."
  },
  {
    question: "Qual o índice oficial de reajuste anual dos contratos?",
    options: ["IPCA sempre.", "Salário Mínimo.", "IGPM (FGV) ou IPCA se negativo.", "Taxa Selic."],
    correctIndex: 2,
    explanation: "Utilizamos o IGPM acumulado. Se ele for negativo, utilizamos o IPCA para garantir que o valor não diminua."
  },
  {
    question: "Qual a multa aplicada para atrasos SUPERIORES a 30 dias?",
    options: ["2% fixo.", "10% sobre o valor + correção.", "5% sem juros.", "Não aplicamos multa."],
    correctIndex: 1,
    explanation: "Após 30 dias, a multa sobe para 10% do valor contratado, além da atualização monetária."
  },
  {
    question: "O que é OBRIGATÓRIO para cancelar a assinatura e parar as cobranças?",
    options: ["Pedir no WhatsApp.", "Comprovante de alteração/baixa do CNPJ.", "Apenas não pagar.", "Ligar para o contador."],
    correctIndex: 1,
    explanation: "O serviço só é encerrado quando recebemos o comprovante oficial de que o endereço não está mais vinculado ao CNPJ."
  },
  {
    question: "A renovação automática ocorre se não houver aviso prévio. Qual o prazo do aviso?",
    options: ["7 dias.", "15 dias.", "30 dias de antecedência.", "60 dias."],
    correctIndex: 2,
    explanation: "O contrato prevê renovação automática se não houver manifestação contrária com 30 dias de antecedência."
  },
  {
    question: "Cliente pagou plano anual e quer cancelar após 6 meses. Ele tem reembolso?",
    options: ["Sim, integral.", "Sim, proporcional.", "Não, apenas em até 7 dias da compra.", "Sim, se reclamar muito."],
    correctIndex: 2,
    explanation: "O reembolso só é devido em até 7 dias (CDC). Planos anuais cancelados antes do fim não geram reembolso do saldo restante."
  },
  {
    question: "Posso parcelar o boleto de renovação?",
    options: ["Não, boleto é só à vista.", "Sim, em até 2x.", "Sim, em 12x.", "Sim, em 6x."],
    correctIndex: 1,
    explanation: "PIX e Boleto podem ser facilitados em até 2x. Para mais parcelas, apenas no cartão de crédito (com juros)."
  },
  {
    question: "Qual o limite mensal de correspondências (cartas)?",
    options: ["Ilimitado.", "10 cartas.", "50 envelopes mensais.", "100 envelopes."],
    correctIndex: 2,
    explanation: "O contrato prevê gestão de até 50 envelopes mensais e 2 caixas pequenas."
  },
  {
    question: "Qual o prazo para cancelar uma reserva de Sala de Reunião sem custo?",
    options: ["1 hora antes.", "2 horas antes.", "24 horas antes.", "Não pode cancelar."],
    correctIndex: 1,
    explanation: "Cancelamentos ou reagendamentos podem ser feitos sem custo até 2 horas antes do horário agendado."
  },
  {
    question: "A Company Hero escaneia encomendas (caixas)?",
    options: ["Sim, abrimos tudo.", "Não, apenas cartas (até 10 pág).", "Só se o cliente pagar extra.", "Sim, tiramos foto da caixa."],
    correctIndex: 1,
    explanation: "Escaneamos apenas conteúdo de cartas/documentos mediante autorização. Não abrimos nem escaneamos encomendas/caixas."
  },
  {
    question: "Se o cliente usar o endereço sem pagar, o que acontece?",
    options: ["Nada.", "Cancelamos o contrato na hora.", "Gera dívida, juros e negativação.", "Mandamos a polícia."],
    correctIndex: 2,
    explanation: "O uso do endereço sem contrapartida financeira gera inadimplência, multas, juros e eventual negativação do CNPJ."
  },
  {
    question: "Qual a ordem correta para Upgrade de Mensal para Anual?",
    options: ["Cancela Mensal -> Cria Anual.", "Cria Anual -> Espera Pagar -> Cancela Mensal.", "Edita o valor do mensal.", "Cria boleto avulso."],
    correctIndex: 1,
    explanation: "Para evitar churn indevido, primeiro garante-se o pagamento do novo contrato anual, para só depois suspender o mensal."
  }
];

const FAQComponent = () => {
  const [openIndex, setOpenIndex] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const toggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const filteredFaqs = React.useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const query = searchQuery.toLowerCase();
    
    return faqs.map(category => ({
      ...category,
      items: category.items.filter(item => 
        item.q.toLowerCase().includes(query) || 
        item.a.toLowerCase().includes(query)
      )
    })).filter(category => category.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">FAQ Oficial de Retenção</h3>
          <p className="text-slate-400 text-sm mb-6">Central de dúvidas para negociação e suporte.</p>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-800/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:ring-1 focus:ring-hero-500 focus:border-hero-500 text-sm transition-all backdrop-blur-sm"
              placeholder="Pesquisar por palavras-chave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="absolute right-0 top-0 w-32 h-32 bg-hero-600 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
      </div>

      {filteredFaqs.length > 0 ? (
        filteredFaqs.map((section, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-hero-500"></span>
                {section.category}
              </h4>
            </div>
            <div className="divide-y divide-gray-50">
              {section.items.map((item, i) => {
                const id = item.q;
                const isOpen = openIndex === id;
                return (
                  <div key={item.q}>
                    <button 
                      onClick={() => toggle(id)}
                      className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors group"
                    >
                      <span className={`text-sm font-medium transition-colors ${isOpen ? 'text-hero-600' : 'text-gray-700'}`}>
                        {item.q}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="text-sm text-gray-600 bg-hero-50/50 p-3 rounded-lg border border-hero-100/50">
                          {item.a}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900">Nenhum resultado encontrado</h3>
          <p className="text-xs text-gray-500 mt-1">Tente buscar por termos diferentes.</p>
        </div>
      )}
    </div>
  );
};

export const modules: Module[] = [
  {
    id: 1,
    title: "Identidade e Tom de Voz",
    category: "Fundamentos",
    icon: <Users className="w-5 h-5" />,
    duration: "30 min",
    content: (
      <div className="space-y-8">
        <div className="prose prose-sm max-w-none text-gray-600">
           <p className="text-lg text-gray-800 font-medium">
             Você já percebeu como um e-mail frio pode arruinar o dia de alguém? Na Company Hero, nós não somos robôs. 
             Somos o parceiro invisível que permite que o empreendedor durma tranquilo sabendo que sua empresa está regular.
           </p>
        </div>

        <InfoBox title="O Jeito Hero de Ser" type="hero">
          <p>Conceito Hero: Não "cobramos", nós <strong>ajudamos a resolver</strong>.</p>
          <p className="mt-1">A Company Hero facilita a vida do empreendedor. Somos parceiros, não credores. A comunicação não deve criar barreiras, mas sim pontes. Lembre-se: por trás de cada CNPJ inadimplente, existe um empreendedor com dificuldades.</p>
        </InfoBox>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" /> 6 Pilares da Comunicação
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Prático", desc: "Direto ao ponto. O empreendedor não tem tempo. Use listas e frases curtas. Prefira ponto final a muitas vírgulas." },
                { label: "Parceiro", desc: "De gente pra gente. Empático. Se vemos um problema, não nos omitimos, tentamos solucionar." },
                { label: "Otimista", desc: "Linguagem pra cima. Ter negócio é empolgante. Use exclamações! Evite palavras como 'problema', 'erro', 'bloqueio'." },
                { label: "Fácil", desc: "Descomplicar. Evitar termos difíceis. Se usar inglês (Churn, MRR, Setup), traduza em seguida." },
                { label: "Transparente", desc: "Tudo às claras. Sem letras miúdas. Se algo der errado, assuma e comunique imediatamente." },
                { label: "Entusiasmado", desc: "Celebre conquistas! Use emoticons (sem ironia). Um simples 'Parabéns pela regularização!' muda tudo." }
              ].map((item, i) => (
                <li key={i} className="flex items-start text-sm group">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" /> 
                  <span className="text-gray-600">
                    <strong className="text-gray-900">{item.label}:</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4">Vocabulário Hero (Transformação)</h4>
            <p className="text-xs text-gray-500 mb-4">Veja como pequenas mudanças nas palavras transformam uma cobrança em uma negociação de sucesso.</p>
            <div className="space-y-2">
              <ComparisonRow wrong='"Você está devendo"' right='"Está em aberto a mensalidade"' />
              <ComparisonRow wrong='"Vim te cobrar"' right='"Vim lembrar do vencimento"' />
              <ComparisonRow wrong='"Não identifiquei o pagamento"' right='"Não localizei o pagamento"' />
              <ComparisonRow wrong='"Sou do financeiro"' right='"Sou do time de sucessso/financeiro"' />
              <ComparisonRow wrong='"Será verificado"' right='"Eu vou verificar agora mesmo"' />
              <ComparisonRow wrong='"O sistema bloqueou"' right='"Precisamos regularizar para liberar"' />
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Book className="w-5 h-5"/> Boas Práticas de Escrita e Postura
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <p className="font-bold text-blue-800 mb-2">Voz Ativa SEMPRE</p>
               <p className="text-sm text-blue-700 mb-2">Evite a voz passiva para não parecer um robô ou burocrático. Assuma a responsabilidade da ação.</p>
               <div className="bg-white p-3 rounded border border-blue-100 text-sm shadow-sm">
                 <span className="text-red-500 line-through block mb-1">"Sua solicitação será analisada."</span>
                 <span className="text-green-700 font-medium block">"Vou analisar sua solicitação agora."</span>
               </div>
             </div>
             <div>
               <p className="font-bold text-blue-800 mb-2">Uso de Emoticons 😉</p>
               <p className="text-sm text-blue-700">Permitidos e incentivados para gerar aproximação. Eles ajudam a dar o tom "Otimista" e "Entusiasmado".</p>
               <p className="text-xs text-blue-600 mt-2 bg-blue-100 p-2 rounded">Cuidado: Nunca use ironia. O emoji deve reforçar a mensagem positiva. Evite em momentos de tensão extrema.</p>
             </div>
             <div>
               <p className="font-bold text-blue-800 mb-2">Português Primeiro</p>
               <p className="text-sm text-blue-700">Priorize palavras em português. Se precisar usar termo técnico em inglês (ex: Churn, Forecast), explique logo em seguida.</p>
             </div>
             <div>
                <p className="font-bold text-blue-800 mb-2">Zero Abreviações</p>
                <p className="text-sm text-blue-700">Evite "vc", "td bem", "att". Escreva o termo completo para garantir clareza e profissionalismo democrático. Não sabemos o nível de instrução do cliente.</p>
             </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "O Ecossistema Hero",
    category: "Fundamentos",
    icon: <Shield className="w-5 h-5" />,
    duration: "45 min",
    content: (
      <div className="space-y-8">
        <h3 className="text-lg font-bold text-gray-900">O que nós realmente vendemos?</h3>
        <p className="text-gray-600 text-sm">Não vendemos apenas um endereço. Vendemos <strong>legitimidade e tranquilidade</strong>. Entenda profundamente os produtos para argumentar com autoridade.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-hero-100 rounded-bl-full opacity-50 transition-transform group-hover:scale-110"></div>
            <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4 text-gray-800 relative z-10">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg relative z-10">Endereço Fiscal</h4>
            <div className="my-3 h-px bg-gray-200 w-full relative z-10"></div>
            <p className="text-sm text-gray-600 mt-2 relative z-10 leading-relaxed">
              O "Core Business". Permite o registro oficial no CNPJ, na Junta Comercial e na Receita Federal. 
              <br/><br/>
              <span className="font-bold text-gray-800">Diferencial:</span> Inclui IPTU, gestão de correspondência, aviso de recebimento e conformidade legal total. Se o cliente cancelar isso, o CNPJ dele fica irregular.
              <br/><br/>
              <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">Não é vendido separadamente.</span>
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-hero-200 transition-colors shadow-sm">
            <div className="w-10 h-10 bg-hero-50 rounded-lg flex items-center justify-center mb-4 text-hero-600">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">Endereço Comercial</h4>
            <div className="my-3 h-px bg-gray-100 w-full"></div>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Focado em <strong>Marketing e Credibilidade</strong>. Serve para colocar no site, cartão de visita e Google Maps. 
              <br/><br/>
              <span className="font-bold text-gray-800">Atenção:</span> Não serve para registro legal na Receita Federal. É puramente estético/comercial. Pode ser um "upsell" ou vendido separadamente para quem já tem sede própria mas quer prestígio.
            </p>
          </div>
        </div>

        <InfoBox title="Pitch de Valor: Por que pagar renovação?" type="hero">
          <p className="mb-2 text-sm">Muitos clientes acham que pagaram pelo "papel" do contrato e pronto. Use este argumento:</p>
          <p className="italic text-gray-700 text-sm border-l-2 border-hero-300 pl-3">
            "Senhor cliente, o endereço fiscal é um serviço contínuo, similar ao aluguel de uma sala física, mas muito mais barato. 
            Enquanto seu CNPJ está aqui, nós somos legalmente responsáveis por receber notificações da prefeitura, receita e justiça em seu nome. 
            A anuidade cobre essa responsabilidade jurídica, o IPTU do imóvel, a equipe de recepção e a manutenção do alvará do local. 
            Sem isso, o CNPJ fica inapto na Receita."
          </p>
        </InfoBox>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
            <Target className="w-5 h-5 text-hero-600"/> 
            <h4 className="font-bold text-gray-800">Matriz de Responsabilidades (Quem resolve?)</h4>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-4">Evite o "ping-pong" com o cliente. Saiba exatamente para onde direcionar.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-white text-gray-500 uppercase text-xs tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-semibold w-1/4">Área</th>
                    <th className="p-4 font-semibold">O que resolve</th>
                    <th className="p-4 font-semibold w-1/4">Contato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-hero-700">Suporte / CX</td>
                    <td className="p-4 text-gray-600">Dúvidas de mensalidade do mês vigente, geração de 2ª via simples, cancelamentos solicitados nos primeiros 6 meses, dúvidas sobre correspondência.</td>
                    <td className="p-4 text-xs font-mono text-gray-500">ajuda@...</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors bg-hero-50/10 border-l-4 border-hero-500">
                    <td className="p-4 font-bold text-hero-700">Financeiro (Você)</td>
                    <td className="p-4 text-gray-800 font-medium">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Mensalidades de meses anteriores (atrasados).</li>
                        <li>Negociações complexas e parcelamentos de dívida.</li>
                        <li>Notas Fiscais (correções e envios manuais).</li>
                        <li>Planos Anuais vencidos (Recuperação).</li>
                      </ul>
                    </td>
                    <td className="p-4 text-xs font-mono text-hero-600 font-bold">ajudafinanceiro@...</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-hero-700">Renovações</td>
                    <td className="p-4 text-gray-600">Renovação anual que está vencendo EXATAMENTE neste mês, Mudança de plano (Upgrade/Downgrade).</td>
                    <td className="p-4 text-xs font-mono text-gray-500">renovacao@...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Rotinas Financeiras",
    category: "Operacional",
    icon: <DollarSign className="w-5 h-5" />,
    duration: "60 min",
    content: (
      <div className="space-y-8">
         <div className="flex items-center gap-3 mb-4">
            <h3 className="font-bold text-lg">O Ciclo de Vida do Pagamento</h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center hover:shadow-md transition-shadow">
             <div className="text-3xl font-black text-green-600 mb-1">Imediato</div>
             <div className="text-xs font-bold text-green-800 uppercase tracking-wide">Cartão e PIX</div>
             <p className="text-[10px] text-green-700 mt-2 font-medium">Baixa automática no Iugu. Se não baixar, é erro de webhook.</p>
           </div>
           <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 text-center hover:shadow-md transition-shadow">
             <div className="text-3xl font-black text-yellow-600 mb-1">24h</div>
             <div className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Boleto (Úteis)</div>
             <p className="text-[10px] text-yellow-700 mt-2 font-medium">Compensação D+1. Pagou sexta? Baixa terça.</p>
           </div>
           <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center hover:shadow-md transition-shadow">
             <div className="text-3xl font-black text-blue-600 mb-1">40d</div>
             <div className="text-xs font-bold text-blue-800 uppercase tracking-wide">Estorno Cartão</div>
             <p className="text-[10px] text-blue-700 mt-2 font-medium">Prazo oficial Iugu é 90, média 40. Avise o cliente!</p>
           </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
             <AlertTriangle className="w-5 h-5 text-gray-400"/> Troubleshooting (Solução de Problemas)
           </h4>
           <div className="space-y-6 divide-y divide-gray-100">
             <div className="flex gap-4 pt-4 first:pt-0">
               <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-500 text-xs">DDA</div>
               <div>
                 <h5 className="font-bold text-gray-900">"Apareceu um boleto que eu não fiz!" (DDA)</h5>
                 <p className="text-sm text-gray-600 mt-1">Explicação Técnica: Todos os boletos gerados (mesmo os automáticos do sistema) são registrados no Banco Central e aparecem no DDA do cliente como "Company Hero".</p>
                 <p className="text-sm text-gray-600 mt-1"><span className="font-bold text-hero-600">Script:</span> "Fique tranquilo. Como somos uma empresa de tecnologia financeira auditada, todo boleto gerado é registrado. Se você já pagou por PIX ou Cartão, pode desconsiderar esse registro no DDA, ele sai automaticamente em alguns dias."</p>
               </div>
             </div>
             <div className="flex gap-4 pt-4">
               <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-500 text-xs">CARTÃO</div>
               <div>
                 <h5 className="font-bold text-gray-900">Troca de Cartão Recusada</h5>
                 <p className="text-sm text-gray-600 mt-1">
                   A atualização do cartão deve ser realizada diretamente pelo cliente no site. Caso ocorra erro durante o processo, isso normalmente está relacionado a bloqueios ou recusas por parte do banco emissor.
                 </p>
                 <p className="text-sm text-gray-600 mt-2">
                   Nessas situações, é necessário que o cliente acione o suporte ou entre em contato com o time financeiro para que seja realizado o cadastro de um novo cartão e a devida regularização da forma de pagamento.
                 </p>
                 <p className="text-xs font-bold text-hero-600 mt-2 border-t border-gray-100 pt-2">
                   Importante: as faturas no cartão são geradas automaticamente 1 dia antes da data de vencimento.
                 </p>
               </div>
             </div>
             <div className="flex gap-4 pt-4">
               <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-500 text-xs">NF</div>
               <div>
                 <h5 className="font-bold text-gray-900">Nota Fiscal não chegou</h5>
                 <p className="text-sm text-gray-600 mt-1">Enviadas automaticamente até o último dia útil. Se o cliente precisa *agora*, encaminhar solicitação para <code className="bg-gray-100 px-1 py-0.5 rounded text-pink-600 font-mono">ajudafinanceiro</code>. Emitimos NF para tudo, exceto Sala de Reunião (que emite apenas Recibo/RPA).</p>
               </div>
             </div>
           </div>
         </div>
         
         {/* REMOVIDO: Processo Crítico: Upgrade (Mensal -> Anual) */}
      </div>
    )
  },
  {
    id: 4,
    title: "Inadimplência e Serasa",
    category: "Operacional",
    icon: <BarChart3 className="w-5 h-5" />,
    duration: "50 min",
    content: (
      <div className="space-y-8">
        <h3 className="font-bold text-lg text-gray-900">Gestão de Crise e Recuperação</h3>
        <p className="text-sm text-gray-600">Lidar com inadimplência exige firmeza e empatia. Entenda os perfis de devedores.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl mb-2">🐢</div>
                <h5 className="font-bold text-sm">O Esquecido</h5>
                <p className="text-xs text-gray-500 mt-1">Quer pagar, mas é desorganizado. <br/><span className="text-green-600 font-bold">Ação:</span> Lembretes gentis e link fácil.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl mb-2">💸</div>
                <h5 className="font-bold text-sm">O Quebrado</h5>
                <p className="text-xs text-gray-500 mt-1">Está sem caixa. <br/><span className="text-yellow-600 font-bold">Ação:</span> Parcelamento e empatia.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl mb-2">😤</div>
                <h5 className="font-bold text-sm">O Insatisfeito</h5>
                <p className="text-xs text-gray-500 mt-1">Não paga por protesto. <br/><span className="text-red-600 font-bold">Ação:</span> Resolver o problema raiz primeiro.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoBox title="Régua de Negociação" type="error">
            <ul className="list-disc list-inside text-sm space-y-2 mt-2">
              <li><strong>&lt; 3 meses de atraso:</strong> Autonomia para isentar juros/multa se pagar à vista o valor principal.</li>
              <li><strong>&gt; 3 meses de atraso:</strong> Multa obrigatória de 10% sobre o valor. Difícil isentar.</li>
              <li><strong>Parcelamentos:</strong> Devem ser aprovados pelo financeiro. Nunca prometa parcelamento sem consultar a calculadora.</li>
            </ul>
          </InfoBox>
          <InfoBox title="Anti-Fraude" type="warning">
             <p className="text-sm mb-2">Clientes com perfil de risco (polícia na unidade, vendas fraudulentas, chargeback recorrente) devem ser suspensos imediatamente.</p>
             <p className="text-xs font-bold">Ferramentas de verificação:</p>
             <ul className="list-disc list-inside text-xs mt-1">
               <li>Consulta CNPJ na Receita Federal (Status: Inapto/Baixado?)</li>
               <li>Busca avançada no Google (Nome da empresa + "Reclame Aqui" ou "Golpe")</li>
             </ul>
          </InfoBox>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            Protocolo de Negativação (Serasa)
          </h3>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-bold text-sm mb-4">
              <PauseCircle className="w-4 h-4" /> EM PAUSA
            </div>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              O protocolo de negativação via Serasa encontra-se temporariamente suspenso ("em pausa nesse momento"). 
              Aguarde novas orientações operacionais antes de seguir com este processo.
            </p>
          </div>
        </div>
        
        {/* REMOVIDO: InfoBox title="Churn Involuntário" */}
      </div>
    )
  },
  {
    id: 5,
    title: "Mapeamento Operacional Estratégico",
    category: "Gestão",
    icon: <ClipboardList className="w-5 h-5" />,
    duration: "45 min",
    content: (
      <div className="space-y-8">
        <p className="text-gray-600 text-sm italic border-l-4 border-hero-200 pl-4 bg-hero-50/20 p-4 rounded-r-lg">
          Este documento apresenta uma visão aprofundada das jornadas de Renovações e Cobrança (C. Hero / MEV). Ele mapeia o ciclo de vida do cliente em momentos críticos, detalhando as réguas de contato, os gargalos operacionais e as estratégias de contenção de perda de receita (Churn).
        </p>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-purple-600" />
            1. A Jornada de Renovações: Prevenção e Negociação
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            A equipe de Renovações opera sob uma janela de tempo restrita e crucial: o próprio mês de vencimento do contrato. A intensidade e o formato da atuação mudam dinamicamente conforme a data limite se aproxima, exigindo respostas rápidas e investigativas dos analistas.
          </p>

          <h4 className="font-bold text-gray-800 text-base mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400"/>
            Régua de Relacionamento e Escalonamento de Contato
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            A estratégia de comunicação é desenhada para aumentar a tração de forma gradual, combinando canais de acordo com a urgência (D = Dia do Vencimento):
          </p>
          
          <div className="space-y-4 mb-8">
             <div className="flex gap-4 group">
                <div className="w-16 flex-shrink-0 text-right font-bold text-green-600 text-sm pt-1">D-3</div>
                <div className="border-l-2 border-green-200 pl-4 pb-2 group-hover:border-green-400 transition-colors">
                   <h5 className="font-bold text-sm text-gray-800">Ações Preventivas</h5>
                   <p className="text-xs text-gray-500 mt-1">O foco aqui é a conveniência. O cliente recebe um lembrete amigável via Treble (WhatsApp/Mensageria). Em D-2, a comunicação é reforçada por meio de um SMS, garantindo que a informação chegue mesmo sem internet.</p>
                </div>
             </div>
             <div className="flex gap-4 group">
                <div className="w-16 flex-shrink-0 text-right font-bold text-blue-600 text-sm pt-1">D0</div>
                <div className="border-l-2 border-blue-200 pl-4 pb-2 group-hover:border-blue-400 transition-colors">
                   <h5 className="font-bold text-sm text-gray-800">O Dia "Zero"</h5>
                   <p className="text-xs text-gray-500 mt-1">No vencimento, o lembrete é incisivo e direto, utilizando uma combinação simultânea de Treble e SMS para garantir a visualização.</p>
                </div>
             </div>
             <div className="flex gap-4 group">
                <div className="w-16 flex-shrink-0 text-right font-bold text-orange-600 text-sm pt-1">D+2</div>
                <div className="border-l-2 border-orange-200 pl-4 pb-2 group-hover:border-orange-400 transition-colors">
                   <h5 className="font-bold text-sm text-gray-800">Recuperação Imediata</h5>
                   <p className="text-xs text-gray-500 mt-1">A partir daqui, o tom muda de "lembrete" para "cobrança de pagamento". A esteira é acionada em D+2, D+4, D+7 e D+10. O nível de atrito aumenta, e a equipe passa a empregar o Treble, o SMS e também as Ligações Telefônicas (garantindo um contato humano para entender a falta de pagamento).</p>
                </div>
             </div>
             <div className="flex gap-4 group">
                <div className="w-16 flex-shrink-0 text-right font-bold text-red-600 text-sm pt-1">Fim Mês</div>
                <div className="border-l-2 border-red-200 pl-4 pb-2 group-hover:border-red-400 transition-colors">
                   <h5 className="font-bold text-sm text-gray-800">Fechamento (Conversão Tática)</h5>
                   <p className="text-xs text-gray-500 mt-1">Para os clientes que chegam ao final do mês sem renovar, a estratégia muda para a conversão tática. É ativada a régua PROMO, oferecendo condições especiais via Treble e Ligações, atuando como a última tentativa de retenção ativa antes da transição de esteira.</p>
                </div>
             </div>
          </div>

          <h4 className="font-bold text-gray-800 text-base mb-4 mt-8 border-b border-gray-100 pb-2 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-400"/>
            Cenário de Conversão e o Risco de ARR
          </h4>
          <p className="text-sm text-gray-600 mb-4">A volumetria de planos Anuais no mês apresenta um cenário de contrastes:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             <div className="bg-green-50 p-4 rounded-lg border border-green-100">
               <h5 className="text-green-800 font-bold text-sm flex items-center gap-2 mb-2"><CheckCircle className="w-4 h-4"/> O Cenário Ideal (45%)</h5>
               <p className="text-xs text-green-700 leading-relaxed">
                 Atualmente, 45% dos pagamentos ocorrem no modelo "No Touch". São clientes engajados que renovam sem a necessidade de intervenção humana da equipe, o que é altamente positivo para a eficiência operacional.
               </p>
             </div>
             <div className="bg-red-50 p-4 rounded-lg border border-red-100">
               <h5 className="text-red-800 font-bold text-sm flex items-center gap-2 mb-2"><AlertOctagon className="w-4 h-4"/> O Gargalo e Risco (55%)</h5>
               <p className="text-xs text-red-700 leading-relaxed mb-2">
                 Os 55% restantes dependem das réguas de cobrança e do esforço humano. O grande ponto de atenção é que aproximadamente <strong className="underline decoration-red-400">20% dessa base representa um risco iminente de Churn</strong>.
               </p>
               <div className="text-[10px] bg-white/50 p-2 rounded text-red-800 font-bold border border-red-200">
                  IMPACTO: R$ 5,5 Milhões em ARR sob risco em 2026.
               </div>
               <p className="text-[10px] text-red-600 mt-2 italic">A equação operacional é clara e implacável: Menos tempo dedicado à base = Menor taxa de conversão.</p>
             </div>
          </div>

          <h4 className="font-bold text-gray-800 text-base mb-4 mt-8 border-b border-gray-100 pb-2 flex items-center gap-2">
             <Search className="w-4 h-4 text-gray-400"/>
             A Fase de Investigação e Convencimento
          </h4>
          <p className="text-sm text-gray-600 mb-4">Os analistas que dedicam mais tempo às ligações realizam um verdadeiro trabalho de inteligência comercial. Essa etapa exige:</p>
          <ul className="space-y-2 text-sm text-gray-600 bg-gray-50 p-5 rounded-lg border border-gray-100">
             <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-hero-400 mt-1.5"></div> Mapeamento do perfil do cliente e entendimento do seu uso atual.</li>
             <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-hero-400 mt-1.5"></div> Identificação do contador responsável (o decisor técnico).</li>
             <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-hero-400 mt-1.5"></div> Descoberta de oportunidades de Cross-sell (venda de produtos adicionais que façam sentido para o momento da empresa).</li>
             <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-hero-400 mt-1.5"></div> <strong>Para clientes com cupom:</strong> É necessário um passo extra para verificar se o contador parceiro atrelado àquele cupom segue ativo na base e, a partir disso, fazer as pontes de comunicação entre Contador e Cliente.</li>
          </ul>

          <h4 className="font-bold text-gray-800 text-base mb-4 mt-8 border-b border-gray-100 pb-2 flex items-center gap-2">
             <MessageCircle className="w-4 h-4 text-gray-400"/>
             Principais Objeções e Desafios de Argumentação
          </h4>
          <p className="text-sm text-gray-600 mb-4">Durante a negociação, o time lida com fricções que exigem roteiros de contorno bem estruturados:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             <div className="border border-gray-200 rounded-lg p-3 hover:border-hero-300 transition-colors">
               <strong className="text-gray-800 text-xs uppercase block mb-1">Falta de Confiança</strong>
               <p className="text-xs text-gray-600">"Não confio / Acho que é golpe." (Exige reforço de marca e prova social).</p>
             </div>
             <div className="border border-gray-200 rounded-lg p-3 hover:border-hero-300 transition-colors">
               <strong className="text-gray-800 text-xs uppercase block mb-1">Desalinhamento de Produto</strong>
               <p className="text-xs text-gray-600">"O que é a Company Hero? / Achei que era um serviço vitalício." (Exige reeducação sobre o modelo de assinatura).</p>
             </div>
             <div className="border border-gray-200 rounded-lg p-3 hover:border-hero-300 transition-colors">
               <strong className="text-gray-800 text-xs uppercase block mb-1">Terceirização da Decisão</strong>
               <p className="text-xs text-gray-600">"Meu contador é quem sabe / quem resolve isso." (Exige mudança de foco para o decisor técnico).</p>
             </div>
             <div className="border border-gray-200 rounded-lg p-3 hover:border-hero-300 transition-colors">
               <strong className="text-gray-800 text-xs uppercase block mb-1">Desconexão B2B2C</strong>
               <p className="text-xs text-gray-600">Quando o contador diz "Eu sou apenas o contador, fale com meu cliente" ou "Não sei quem é esse cliente". (Exige investigação para reconectar as partes).</p>
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            2. A Jornada de Cobrança (C. Hero / MEV): Gestão da Inadimplência
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Quando os esforços iniciais falham, o cliente entra na esteira de Cobrança. Esta equipe atua de forma cirúrgica: assume os clientes de planos mensais a partir de D+1 do vencimento, e os clientes de planos anuais de competências anteriores que não foram resolvidos pelo time de Renovações. A comunicação padronizada em toda a régua utiliza Treble, E-mails e Ligações.
          </p>

          <h4 className="font-bold text-gray-800 text-base mb-6 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400"/>
            O Ciclo de Envelhecimento da Dívida (Aging)
          </h4>

          <div className="relative border-l-4 border-gray-200 ml-4 space-y-8 py-2">
             <div className="relative pl-8">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-4 border-gray-300"></div>
                <h5 className="font-bold text-gray-900 text-sm">Fase Inicial (01 a 29 dias)</h5>
                <p className="text-xs text-gray-500 mt-1">Tentativas intensivas de contato logo após o atraso.</p>
                <div className="mt-2 bg-red-50 border border-red-100 p-2 rounded text-[10px] text-red-700 font-bold inline-block">
                   🚨 Alerta "Tudo MEI": Política Tolerância Zero. Churn decretado aqui se não houver pagamento.
                </div>
             </div>
             <div className="relative pl-8">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-4 border-yellow-400"></div>
                <h5 className="font-bold text-gray-900 text-sm">Fase Intermediária (30 a 60 dias)</h5>
                <p className="text-xs text-gray-500 mt-1">O cliente segue recebendo a régua de cobrança padrão, com alertas crescentes sobre as consequências da inadimplência.</p>
             </div>
             <div className="relative pl-8">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-4 border-orange-500"></div>
                <h5 className="font-bold text-gray-900 text-sm">Fase Pré-Serasa (61 a 89 dias)</h5>
                <p className="text-xs text-gray-500 mt-1">Momento de notificação crítica. O cliente é avisado que as sanções legais e restrições de crédito estão iminentes.</p>
             </div>
             <div className="relative pl-8">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-4 border-red-600"></div>
                <h5 className="font-bold text-gray-900 text-sm">Fase de Suspensão (+90 dias)</h5>
                <p className="text-xs text-gray-500 mt-1">Ação punitiva. Os serviços são oficialmente suspensos. Se o cliente utiliza o serviço de Endereço (Company Hero), ocorre a inclusão nos cadastros do Serasa.</p>
             </div>
             <div className="relative pl-8">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-4 border-slate-700"></div>
                <h5 className="font-bold text-gray-900 text-sm">Cobrança Terceirizada (90 a 179 dias)</h5>
                <p className="text-xs text-gray-500 mt-1">A empresa cessa os esforços internos. Os clientes suspensos são repassados para assessorias de cobrança especializadas. É neste marco que o Churn por inadimplência é oficialmente contabilizado para a base geral.</p>
             </div>
             <div className="relative pl-8">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-4 border-slate-900"></div>
                <h5 className="font-bold text-gray-900 text-sm">Fase Extrajudicial (+180 dias)</h5>
                <p className="text-xs text-gray-500 mt-1">Se a assessoria não obtiver sucesso, os clientes retornam "para casa", mas saem do escopo comercial/cobrança e entram para tratativa interna do setor Jurídico, focada em recuperação de ativos de difícil recebimento.</p>
             </div>
          </div>
        </div>

        <InfoBox title="A Regra de Ouro: O Pipeline de Retenção" type="hero">
          <p className="font-bold text-slate-800 text-sm mb-2">Protocolo de Segurança Transversal</p>
          <p className="text-sm text-slate-700 mb-3">
            Existe um protocolo de segurança transversal a todas as etapas acima, seja em D-3 de Renovação ou no D+60 de Cobrança: <strong>A Solicitação de Cancelamento</strong>.
          </p>
          <div className="bg-white/60 p-3 rounded border border-hero-200">
             <p className="text-sm text-hero-800 italic">
               "Se, em qualquer interação, através de qualquer canal, o cliente verbalizar o desejo de cancelar, todo o fluxo de cobrança ou renovação é pausado imediatamente. O cliente é retirado das réguas automatizadas e direcionado exclusivamente para o Pipeline de Retenção, onde uma analista especializada assumirá o caso com foco em salvar a conta e entender a causa raiz da insatisfação."
             </p>
          </div>
        </InfoBox>
      </div>
    )
  },
  {
    id: 6,
    title: "Operações Especiais (Manuais)",
    category: "Gestão",
    icon: <Book className="w-5 h-5" />,
    duration: "40 min",
    content: (
      <div className="space-y-8">
        <h3 className="font-bold text-lg text-gray-900">Exceções que viram Regra</h3>
        <p className="text-sm text-gray-600">Nem tudo é automático. Aqui estão os processos manuais que salvam a operação.</p>

        <InfoBox title="Faturas Manuais (Intranet)" type="warning">
          <p className="mb-3 text-sm">Usadas para 2ª via, correção de juros, bugs no Iugu ou unificação de dívidas. O preenchimento da descrição deve ser rigoroso para rastreio futuro.</p>
          <div className="bg-white/50 p-3 rounded border border-yellow-300/50 text-xs font-mono text-yellow-900 mb-2">
            Padrão Obrigatório de Descrição:<br/>
            (Fatura: ID_DA_ULTIMA_FATURA_ORIGINAL - Mês Dia, Ano)<br/>
            Exemplo Real: (Fatura: 64C0F64BD... - Oct 16, 2024)<br/>
            <span className="italic text-yellow-800 opacity-75">*Mês em inglês abreviado (Sep, Oct, Nov...) pois o sistema é internacional.</span>
          </div>
          <p className="text-xs font-bold mt-2">Validação: Após criar a fatura manual, é obrigatório validar no Wagtail ("Contrato &gt; Order &gt; +Add Order") para liberar o onboarding do cliente, caso seja uma renovação.</p>
        </InfoBox>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex items-center gap-2 mb-3">
               <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">MEI</span>
               <h4 className="font-bold text-gray-800">Produto "Tudo MEI"</h4>
             </div>
             <p className="text-sm text-gray-600">Perfil de cliente que administra sozinho, ticket baixo, alto volume. Cobrança automatizada via Treble/SMS.</p>
             <p className="text-sm text-gray-600 mt-2 border-t pt-2"><strong>Régua de Suspensão MEI:</strong> Mais agressiva. Ocorre duas vezes ao mês, nos dias <strong>10 e 25</strong> (após 32 dias de atraso). O cliente tem 48h para regularizar após notificação via WhatsApp antes do bloqueio.</p>
           </div>
           <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
               <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">EXT</span>
               <h4 className="font-bold text-gray-800">Cobrança Terceirizada</h4>
             </div>
             <p className="text-sm text-gray-600 mb-2">Quando esgotamos nossos recursos, enviamos para parceiros (ex: TMB).</p>
             <ul className="text-sm text-gray-600 space-y-1 bg-gray-50 p-2 rounded">
                <li><strong>Virtual:</strong> Login company, hero | Senha 1234</li>
                <li><strong>TMB:</strong> Login COMPANY | Senha 2024</li>
             </ul>
             <p className="text-xs text-red-600 mt-2 border-t pt-2 bg-red-50 p-2 rounded"><strong>Regra de Ouro:</strong> Se o cliente está na lista da terceirizada mas paga direto para nós (Hero), ainda devemos a comissão de 10% para o parceiro por contrato.</p>
           </div>
        </div>
        
        <InfoBox title="Suspensão em Massa (Kill Switch)" type="error">
          <p className="text-sm">Processo delicado realizado todo dia 25, às 09h da manhã.</p>
          <ol className="list-decimal list-inside text-sm mt-1 space-y-1">
            <li>Filtrar etapa "suspensão" na planilha mestre.</li>
            <li>Enviar e-mail de "Pré-Cancelamento" via MailMerge (Aviso final).</li>
            <li>Preencher a "Planilha de Suspensão em Massa" com os IDs.</li>
            <li>Enviar para o time de Tech rodar o script de bloqueio no sistema.</li>
            <li><strong>Verificação:</strong> Checar aleatoriamente 5 clientes para ver se o acesso foi realmente cortado.</li>
          </ol>
        </InfoBox>
      </div>
    )
  },
  {
    id: 7,
    title: "Playbook de Situações Críticas",
    category: "Prática",
    icon: <Zap className="w-5 h-5" />,
    duration: "45 min",
    content: (
      <div className="space-y-8">
        <h3 className="font-bold text-lg text-gray-900">Scripts de Retenção e Quebra de Objeções</h3>
        <p className="text-sm text-gray-600">Não improvise na hora da crise. Use os scripts validados.</p>
        
        <div className="space-y-6">
          
          {/* REMOVIDO: Objeção 1: "Quero cancelar" */}
          
          <div>
             <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
               <DollarSign className="w-4 h-4"/> Objeção 1: Reembolsos (Anual Parcelado)
             </h4>
             <p className="text-sm text-gray-600 mb-2">Cliente pagou 3 parcelas de 12 e quer cancelar e parar de pagar as outras 9.</p>
             <ScriptCard 
               title="Script Reembolso Anual"
               script={`Entendo sua situação. Porém, o plano anual funciona como uma compra parcelada de um produto (como uma TV ou Celular) no cartão, e não como uma mensalidade recorrente (como Netflix).\n\nO parcelamento é um acordo direto entre você e o seu banco emissor do cartão. Nós não temos acesso para estornar parcelas de um serviço já contratado com desconto.\n\nO que faremos é suspender a renovação automática para o próximo ciclo, para que não haja nova cobrança ano que vem.`}
             />
          </div>

          <div className="w-full h-px bg-gray-200"></div>

          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
               <FileText className="w-4 h-4"/> Objeção 2: "Só pago no Boleto"
            </h4>
            <p className="text-sm text-gray-600 mb-2">Cliente mensal que odeia cartão de crédito.</p>
            <ScriptCard 
              title="Script de Conversão (Upgrade)"
              script={`Entendo perfeitamente. Nossas mensalidades são via cartão justamente para garantir a continuidade do serviço sem bloqueios acidentais.\n\nMas, já que você prefere boleto, tenho uma solução melhor: A migração para o plano anual no boleto à vista.\n\nAlém de você ganhar um desconto de X%, você resolve essa pendência financeira de uma vez só e não precisa ficar me solicitando boleto todo dia 10. O que acha de eu simular o valor com desconto para você?`}
            />
          </div>

          <div className="w-full h-px bg-gray-200"></div>

          <div>
             <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
               <Users className="w-4 h-4"/> Objeção 3: "Meu contador disse que não preciso pagar"
            </h4>
            <ScriptCard 
              title="Script Educativo"
              script={`Entendo. As vezes há uma confusão entre os honorários do contador e o aluguel do endereço fiscal.\n\nA Company Hero é a proprietária do imóvel onde sua empresa está registrada. Nós garantimos o IPTU, Alvará e a recepção das suas correspondências oficiais. Se não houver esse pagamento, juridicamente não podemos manter o vínculo, e seu contador precisará transferir sua empresa para outro local para evitar irregularidade na Receita Federal.\n\nQuer que eu explique isso diretamente para ele? Posso enviar um e-mail formalizando.`}
            />
          </div>

          <InfoBox title="Redirecionamento de Demandas" type="info">
             <ul className="text-sm space-y-1">
               <li><strong>Suporte (ajuda@):</strong> Resolve mês atual, 2ª via simples, dúvidas de app.</li>
               <li><strong>Financeiro (ajudafinanceiro@):</strong> Meses anteriores, acordos, parcelamentos, NFs manuais.</li>
               <li><strong>Renovações (renovacao@):</strong> Anual vencendo no mês corrente e mudança de plano.</li>
             </ul>
          </InfoBox>
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: "FAQ Oficial e Retenção",
    category: "Prática",
    icon: <MessageCircle className="w-5 h-5" />,
    duration: "Reference",
    content: (
      <FAQComponent />
    )
  }
];