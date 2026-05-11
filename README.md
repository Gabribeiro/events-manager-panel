# Events Manager Panel

Painel de gestão de eventos com controle de acesso, check-in de participantes e dashboard de métricas em tempo real.

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/Gabribeiro/events-manager-panel.git
cd events-manager-panel
npm install
```

### 2. Subir a API local (json-server)

Em um terminal separado:

```bash
git clone https://github.com/ThiagoLifters/api_test.git ~/api_test
cd ~/api_test
npx json-server --watch db.json --port 3001
```

> A API ficará disponível em `http://localhost:3001`

### 3. Rodar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### 4. Rodar os testes

```bash
npm test
```

---

## Funcionalidades implementadas

### Tela 1 — Listagem de Eventos

- Cards com nome, data, localização, status e taxa de entrada
- Busca por nome com **debounce de 300ms**
- Filtro por status (ativo, encerrado, cancelado)
- Ordenação por data (crescente/decrescente)
- Estados de: carregamento (skeleton), lista vazia e erro de requisição

### Tela 2 — Dashboard do Evento

- 4 cards de métricas: participantes esperados, check-ins realizados, tentativas com erro e taxa de entrada
- Gráfico de área: evolução de entradas ao longo do tempo (por hora)
- Gráfico de rosca: proporção de sucesso vs erros
- Tabela de participantes responsiva (desktop e mobile)
- Botão de check-in inteligente com todas as regras de negócio

### Internacionalização (i18n)

- Suporte a **português (pt)** e **inglês (en)** via segmento de URL (`/pt/...`, `/en/...`)
- Seletor de idioma presente em todas as telas
- Middleware de detecção automática: cookie → header `Accept-Language` → padrão `pt`
- Componentes de servidor usam `getT(lang)` (síncrono); componentes de cliente usam `useLang()` (contexto)
- Todas as strings de UI — labels, toasts, mensagens de erro e tooltips — são traduzidas

### Tema dark/light

- Alternância entre modo claro e escuro com botão Sun/Moon em todas as telas
- Detecta automaticamente a preferência do sistema (`prefers-color-scheme`)
- Persiste a escolha do usuário entre sessões (localStorage)
- Todos os componentes têm variantes `dark:` — cards, tabelas, inputs, gráficos (Recharts Tooltip dinâmico), skeletons e badges

### Documentação da API (Swagger)

- Spec OpenAPI 3.0 completa em `/api/openapi` cobrindo os 7 endpoints
- Interface Swagger UI acessível em `/<lang>/api-docs`
- Isolada via iframe + CDN para evitar conflitos com React 19 Strict Mode

### Regras de negócio

| Situação | Resultado |
|----------|-----------|
| VIP fora do evento | Registra entrada → status "inside" |
| VIP dentro do evento | Registra saída → status "outside" |
| Normal (1ª vez) | Registra check-in → não pode repetir |
| Normal (2ª vez) | Botão desabilitado, label "Já realizado" |
| Evento encerrado | Todos os botões bloqueados |
| Evento cancelado | Todos os botões bloqueados |

---

## Decisões técnicas

### Stack

| Tecnologia | Motivo |
|------------|--------|
| **Next.js 16 + App Router** | Roteamento por arquivo, SSR nativo, padrão da indústria |
| **React Query v5** | Gerenciamento de estado de servidor com cache, revalidação automática e `invalidateQueries` para atualizações em tempo real |
| **Axios** | Cliente HTTP robusto com interceptadores, mais previsível que `fetch` nativo |
| **Recharts** | Biblioteca de gráficos madura para React, leve e totalmente customizável |
| **Sonner** | Toast notifications modernas, acessíveis e de baixo footprint |
| **Tailwind CSS 4** | Utilidade-first com excelente DX; evita context-switch para arquivos de estilo |
| **Vitest + Testing Library** | Setup ultrarrápido com jsdom, API idêntica ao Jest mas com melhor suporte a ESM e Vite |
| **i18next + react-i18next** | Solução madura para i18n; `getT(lang)` síncrono para Server Components e `useLang()` context para Client Components |
| **ThemeProvider próprio** | `useLayoutEffect` aplica a classe `dark` antes do primeiro paint sem injetar `<script>` no React tree — evita warning do React 19 que a biblioteca `next-themes@0.4.x` dispara |

### Arquitetura

A estrutura segue separação clara de responsabilidades:

```
services/     ← acesso à API (classes estáticas, inspiradas em projeto real)
hooks/        ← React Query: useEvents, useEventDetail, useCheckin
components/   ← ui/ (genéricos) + events/ + dashboard/ (domínio)
providers/    ← QueryProvider, LanguageProvider, ThemeProvider
types/        ← contrato de dados centralizado (Event, Participant, Checkin, LangType)
utils/        ← cn (classe helper), format (formatação), getT (tradução síncrona)
config/       ← i18next + locales pt/en
```

A lógica de negócio do check-in vive inteiramente no hook `useCheckin`, não nos componentes. Isso facilita testes unitários e reutilização.

### Estratégia de i18n

Componentes de servidor (ex.: `EventCard`, `EventList`, `DashboardHeader`) recebem `lang` como prop e chamam `getT(lang)` — função síncrona que lê os JSONs de tradução diretamente. Componentes de cliente usam `useLang()` do `LanguageProvider`, evitando prop-drilling. A detecção de idioma acontece no middleware com precedência: cookie `i18next` → header `Accept-Language` → padrão `pt`.

### Estratégia de tema

`ThemeProvider` próprio (sem dependência externa) usa `useLayoutEffect` para ler o `localStorage` e aplicar a classe `dark` no `<html>` antes do primeiro paint — sem flash e sem injetar `<script>` na árvore React (padrão que o React 19 rejeita com warning). O Tailwind CSS 4 aplica os estilos via `@custom-variant dark`. Os componentes Recharts (Tooltip e CartesianGrid) não suportam classes CSS — eles leem `useTheme().resolvedTheme` em tempo de execução para aplicar as cores corretas dinamicamente.

### Otimizações

- Filtragem e ordenação feitas no cliente (`useMemo`) — o dataset é pequeno e evita round-trips desnecessários
- Debounce de 300ms na busca para não disparar re-renders a cada tecla
- `QueryClient` com `staleTime: 30s` para evitar refetch excessivo na navegação entre páginas
- Tabela de participantes com versão desktop (table) e mobile (cards) para melhor responsividade

### Bugs encontrados e corrigidos durante o desenvolvimento

**`checkin_count` do participante contava saídas como entradas** — o PATCH `/participants` incrementava o contador em toda ação (entrada _e_ saída de VIP). Corrigido para incrementar apenas em `action === 'entry'`, refletindo corretamente o número de vezes que o participante entrou no evento.

**Contadores da listagem não atualizavam ao voltar do dashboard** — `invalidateQueries` apontava para `['events', eventId]` (query do detalhe), enquanto a listagem usa a chave `['events']`. O React Query não propaga invalidação para chaves pai. Corrigido para invalidar `['events']`, que cobre lista e detalhe via fuzzy matching.

---

## O que melhoraria com mais tempo

1. **Paginação server-side** na tabela de participantes para eventos com centenas de inscritos
2. **Otimistic updates** no check-in (atualizar a UI antes da resposta da API para resposta imediata)
3. **SSR / prefetch** na listagem de eventos com `prefetchQuery` do Next.js para melhorar o LCP
4. **Acessibilidade** mais abrangente: foco gerenciado em modais/toasts, suporte a leitores de tela
5. **Skeleton individual** para cada card de métrica na tela de detalhe
6. **Testes E2E** com Playwright cobrindo o fluxo completo do check-in

---

## Como a IA foi usada no processo

O desenvolvimento deste projeto utilizou **Claude Code (Anthropic)** como ferramenta de apoio ativa. Abaixo descrevo onde e como a IA contribuiu:

### 1. Análise do desafio e definição da arquitetura

Antes de escrever qualquer linha de código, usei IA para analisar o enunciado completo do desafio e identificar todas as regras de negócio implícitas. A IA mapeou os 5 casos de check-in da tabela de interações, identificou os edge cases (EVT-002 fechado, EVT-004 cancelado, VIP com múltiplas entradas/saídas) e sugeriu a separação em `services → hooks → components`, inspirada em um projeto real de referência.

**Por que usar IA aqui:** Um arquiteto experiente faz esse mapeamento de requisitos → estrutura mental antes de codificar. A IA acelerou esse processo de ~1h para ~15min, sem perder qualidade.

### 2. Reaproveitamento de código de projeto existente

A IA analisou um projeto de referência fornecido pelo desenvolvedor e identificou padrões reutilizáveis: a função `twsx` (Tailwind Merge + clsx), o sistema de variantes do Badge, e o padrão de classes estáticas nos services. Esses padrões foram transportados e adaptados para este projeto.

**Por que usar IA aqui:** Busca por padrões em codebases desconhecidas é exatamente o tipo de tarefa em que a IA reduz tempo e aumenta consistência de código.

### 3. Geração de tipos TypeScript a partir do schema da API

A IA gerou os tipos `Event`, `Participant`, `Checkin` e `CheckinPayload` diretamente do JSON de exemplo fornecido na documentação da API, incluindo os tipos literais (`'vip' | 'normal'`, `'inside' | 'outside'`, etc.).

**Por que usar IA aqui:** Escrita de tipos é mecânica mas crítica para a segurança do código. A IA faz isso em segundos sem erros.

### 4. Identificação dos cenários de teste de maior valor

Dado o critério de avaliação (5% para testes), a IA identificou os 3 casos de maior impacto para cobrir com testes automatizados: estados de UI (loading/empty/error), regra de negócio central (duplo check-in normal), e interação completa (VIP entry com POST + PATCH + toast). Isso garante cobertura das regras de negócio sem desperdício de tempo com testes de baixo valor.

**Por que usar IA aqui:** Priorização de testes é uma decisão de produto+técnico que a IA apoia com base nos critérios de avaliação fornecidos.

### 5. Revisão de edge cases no hook useCheckin

A IA revisou o `useCheckin.ts` para garantir que todos os edge cases estavam cobertos: o que acontece com o `entry_rate` após um erro, o que acontece com `checkin_count` em saída de VIP (não incrementa a contagem de entradas do evento), e a ordem correta das chamadas à API (POST → PATCH participant → PATCH event).

**Por que usar IA aqui:** Revisão de lógica complexa com múltiplos estados é onde bugs silenciosos aparecem. A IA funciona como um par de olhos extra.

### 6. Design da estratégia dual de i18n

A IA identificou o problema de tradução em Server Components (sem hooks) vs Client Components (com contexto) e propôs a solução de duas funções: `getT(lang)` síncrono para o lado do servidor e `useLang()` context para o lado do cliente. Também detectou e corrigiu dois problemas não óbvios: o conflito de tipos do `LanguageDetector` com TypeScript estrito (resolvido com `as any` cirúrgico) e o mock de `@/providers/LanguageProvider` nos testes unitários para que `getT('pt')` retornasse traduções reais em vez das chaves brutas.

**Por que usar IA aqui:** O split server/client de i18n em Next.js App Router é não-óbvio. A IA explorou as restrições e propôs a arquitetura correta na primeira tentativa.

### 7. Isolamento de Swagger UI do React 19

A IA diagnosticou o aviso `UNSAFE_componentWillReceiveProps` gerado pelo componente `ModelCollapse` do `swagger-ui-react` — incompatível com React 19 Strict Mode — e propôs a solução de iframe + CDN, que isola completamente o Swagger UI da árvore React e elimina todos os warnings sem precisar fazer fork ou patch da biblioteca.

**Por que usar IA aqui:** Problemas de compatibilidade com bibliotecas de terceiros costumam ter soluções não documentadas. A IA reconheceu o padrão e sugeriu o contorno mais limpo.
