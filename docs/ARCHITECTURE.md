\# 📜 Bargana - Documentação Técnica Oficial



Bem-vindo à documentação técnica do \*\*Bargana\*\*, a plataforma premium de monitoramento de ofertas gamer. Este documento serve como a fonte de verdade para a arquitetura, banco de dados, segurança e padrões de desenvolvimento do projeto.



\---



\## 1. Visão Geral e Arquitetura do Sistema



O Bargana é construído sobre uma arquitetura moderna, server-first, projetada para alta performance e escalabilidade.



\*   \*\*Framework:\*\* Next.js 15 (App Router)

\*   \*\*Linguagem:\*\* TypeScript (Strict Mode)

\*   \*\*Estilização:\*\* TailwindCSS (Tema escuro customizado: Preto `#0A0A0A` e Dourado `#D4AF37`)

\*   \*\*Banco de Dados \& Auth:\*\* Supabase (PostgreSQL, GoTrue, RLS)

\*   \*\*Gráficos:\*\* Recharts (Area Charts estilo SteamDB)

\*   \*\*Notificações:\*\* Sonner (Toasts)



\### Padrão Arquitetural (Server-First)

1\.  \*\*Server Components (RSC):\*\* Páginas como `/` (Home) e `/product/\[slug]` são renderizadas no servidor. Dados são buscados no Supabase via SSR Client, processados e enviados como HTML estático (ISR com `revalidate = 60s`), eliminando cargas de JS no cliente e resolvendo problemas N+1.

2\.  \*\*Client Components:\*\* Usados apenas para interatividade (Gráficos, Contextos de Auth/Wishlist, Filtros).

3\.  \*\*Database Views:\*\* A view `deals\_with\_lowest\_price` abstrai lógicas complexas de agrupamento (ex: encontrar o menor preço entre várias lojas para o mesmo jogo) transferindo o processamento do Node.js para o PostgreSQL.



\---



\## 2. Estrutura de Pastas



```text

bargana/

├── app/                      # Rotas do Next.js (App Router)

│   ├── auth/callback/        # Rota API para redirecionamento OAuth

│   ├── dashboard/            # Dashboard do usuário (Client Component)

│   ├── login/                # Tela de Login/Cadastro

│   ├── product/\[slug]/       # Página individual do produto (Server Component)

│   ├── profile/              # Perfil e contas conectadas

│   ├── wishlist/             # Lista de desejos

│   ├── error.tsx             # Error Boundary Global

│   ├── not-found.tsx         # Página 404 Global

│   ├── layout.tsx            # Layout raiz (Providers, Sidebar, Header)

│   ├── page.tsx              # Home Page (Server Component, ISR)

│   └── sitemap.ts            # Gerador de Sitemap dinâmico (SEO)

├── components/               # Componentes reutilizáveis

│   ├── ui/                   # Componentes base (Buttons, Inputs)

│   ├── Header.tsx            # Cabeçalho fixo e barra de pesquisa

│   ├── Sidebar.tsx           # Navegação lateral recolhível

│   ├── OfferCard.tsx         # Card de oferta utilizado na Home

│   └── product/              # Componentes específicos da página de produto

│       ├── PriceHistoryChart.tsx # Gráfico interativo (Downsampling)

│       ├── StoreComparison.tsx   # Tabela comparativa de lojas

│       └── PriceAlertManager.tsx # CRUD de alertas de preço

├── context/                  # Provedores de estado global (Client-side)

│   ├── AuthContext.tsx        # Sessão do Supabase, Login, Logout, OAuth

│   └── WishlistContext.tsx    # Lista de desejos (UI Otimista)

├── lib/                      # Utilitários e configurações

│   ├── supabase/             # Clientes Supabase

│   │   ├── client.ts         # Singleton para Client Components

│   │   ├── server.ts         # Client Components (Async cookies Next15)

│   │   └── middleware.ts     # Lógica de refresh token e proteção de rotas

│   ├── scrapers/             # Arquitetura base para futuros scrapers

│   └── data.ts               # Dados estáticos (lista de plataformas)

├── types/

│   └── database.ts           # Tipos gerados do Supabase (com parse de numeric)

├── supabase/                 # Scripts SQL

│   ├── schema.sql            # Schema inicial, RLS e Triggers

│   ├── optimizations.sql     # Views, Índices e Constraints de Segurança

│   └── seed.sql              # Dados de demonstração

└── middleware.ts              # Interceptação de rotas (Next.js Middleware)

```



\---



\## 3. Rotas da Aplicação



| Rota | Método de Renderização | Proteção | Descrição |

| :--- | :--- | :--- | :--- |

| `/` | RSC (ISR 60s) | Pública | Home com ofertas agregadas por menor preço. Usa View do DB. |

| `/login` | CSR | Pública (Redireciona se logado) | Autenticação Email/Senha e OAuth (Google/Discord). |

| `/product/\[slug]` | RSC | Pública | Página de detalhes, gráfico histórico, comparação e alertas. |

| `/wishlist` | CSR | \*\*Protegida\*\* | Itens salvos pelo usuário logado. |

| `/profile` | CSR | \*\*Protegida\*\* | Dados do usuário e contas conectadas (Steam, Xbox, etc). |

| `/dashboard` | CSR | \*\*Protegida\*\* | Estatísticas de economia e alertas. |

| `/auth/callback` | Rota API | Pública | Troca o código do OAuth por uma sessão válida do Supabase. |



\---



\## 4. Banco de Dados e Relacionamentos



\### Diagrama ER (Entidade-Relacionamento)



```mermaid

erDiagram

&#x20;   AUTH\_USERS ||--|| profiles : "1:1"

&#x20;   profiles ||--|| user\_preferences : "1:1"

&#x20;   profiles ||--o{ wishlists : "1:N"

&#x20;   profiles ||--o{ price\_alerts : "1:N"

&#x20;   profiles ||--o{ linked\_accounts : "1:N"

&#x20;   products ||--o{ product\_listings : "1:N (Múltiplas lojas)"

&#x20;   product\_listings ||--o{ price\_history : "1:N (Série temporal)"

&#x20;   products ||--o{ wishlists : "1:N"



&#x20;   products {

&#x20;       uuid id PK

&#x20;       text title

&#x20;       text slug "Único, usado na URL"

&#x20;       text image\_url

&#x20;       text platform

&#x20;   }

&#x20;   product\_listings {

&#x20;       uuid id PK

&#x20;       uuid product\_id FK

&#x20;       text store

&#x20;       numeric current\_price "Parse para float no frontend"

&#x20;       numeric original\_price

&#x20;       boolean is\_lowest\_price

&#x20;   }

&#x20;   price\_history {

&#x20;       uuid id PK

&#x20;       uuid listing\_id FK "Atrelado à loja específica"

&#x20;       numeric price

&#x20;       timestamp recorded\_at

&#x20;   }

```



\### Tabelas Principais

1\.  \*\*`products`\*\*: O item base (Jogo, Hardware). Independente de loja.

2\.  \*\*`product\_listings`\*\*: O anúncio. Relaciona `product\_id` com `store`. Garante que um produto não se duplique na Home, apenas mostra lojas diferentes.

3\.  \*\*`price\_history`\*\*: Atrelada ao `listing\_id`. Permite traçar o gráfico da Steam separadamente da GOG para o mesmo jogo.

4\.  \*\*`wishlists` / `price\_alerts`\*\*: Atreladas ao `user\_id` e `product\_id`.

5\.  \*\*`deals\_with\_lowest\_price` (View)\*\*: Agrega `products` e `product\_listings`, retornando apenas a linha com o menor preço por produto, resolvendo N+1 queries.



\---



\## 5. Segurança e Políticas RLS



O Supabase Row Level Security (RLS) é a camada primária de segurança.



\*   \*\*Tabelas Públicas (Leitura):\*\* `products`, `product\_listings`, `price\_history` (`SELECT` permitido para todos usando `true`).

\*   \*\*Tabelas de Usuário (Escrita Própria):\*\* `wishlists`, `price\_alerts`, `linked\_accounts`, `user\_preferences`. As políticas RLS exigem `auth.uid() = user\_id`.

\*   \*\*Constraint Anti-Abuso:\*\* Um Trigger no banco (`limit\_price\_alerts()`) impede que um usuário crie mais de 3 alertas de preço para o \*mesmo\* produto, prevenindo spam.



\---



\## 6. Fluxo de Autenticação



1\.  \*\*Email/Senha:\*\* Supabase Auth dispara Trigger `on\_auth\_user\_created`, que insere automaticamente nas tabelas `profiles` e `user\_preferences`.

2\.  \*\*OAuth (Google/Discord):\*\* Redireciona para o provedor, retorna a `/auth/callback`. A rota usa `supabase.auth.exchangeCodeForSession(code)` para estabelecer o cookie HTTPOnly.

3\.  \*\*SSR Session Refresh:\*\* O `middleware.ts` intercepta \*todas\* as requisições, chama `supabase.auth.getUser()` para validar o JWT e refresca o token se necessário, garantindo que Server Components sempre tenham o estado do usuário atualizado.

4\.  \*\*Proteção de Rota:\*\* O Middleware checa a existência de `user`. Se nulo e a rota for `/wishlist`, `/profile` ou `/dashboard`, redireciona para `/login`.



\---



\## 7. Variáveis de Ambiente



Crie um arquivo `.env.local` na raiz do projeto:



```env

NEXT\_PUBLIC\_SUPABASE\_URL=https://<seu-projeto>.supabase.co

NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=<sua-anon-key>

NEXT\_PUBLIC\_SITE\_URL=http://localhost:3000 # Usado no OAuth Callback e Sitemap

```



\---



\## 8. Dependências Principais



\*   `next` (v15+), `react`, `react-dom`

\*   `@supabase/ssr` \& `@supabase/supabase-js` (Gerenciamento de sessão SSR/CSR)

\*   `tailwindcss` (Estilização)

\*   `recharts` (Gráficos interativos)

\*   `lucide-react` (Ícones)

\*   `sonner` (Toasts)



\---



\## 9. Guia para Novos Desenvolvedores



\### Setup Local

1\.  Clone o repositório e rode `npm install`.

2\.  Crie o projeto no Supabase e rode os scripts SQL na ordem: `schema.sql` -> `optimizations.sql` -> `seed.sql`.

3\.  Configure o `.env.local`.

4\.  Rode `npm run dev`.

5\.  \*\*Importante:\*\* Devido ao Next.js 15, lembre-se que `cookies()` é assíncrono. Sempre use `await cookies()` em Server Components.



\### Padrão de Dados Numéricos

O PostgreSQL retorna colunas `numeric` como `string` para o Javascript. O Bargana utiliza uma função utilitária `parsePrice` para converter isso antes de renderizar. Se você criar uma nova query que busque `current\_price`, sempre aplique o parse.



\---



\## 10. 🤖 Guia para IA: Continuando o Desenvolvimento (Parte 5+)



Se você é uma IA assumindo este projeto, aqui estão as decisões arquiteturais críticas que você DEVE respeitar:



1\.  \*\*Server Components vs Client Components:\*\* NÃO converta a Home Page (`app/page.tsx`) ou a Página de Produto (`app/product/\[slug]/page.tsx`) inteiramente para Client Components. O SEO e a performance dependem do ISR/RSC. Extraia apenas a parte interativa (ex: o gráfico) como um Client Component filho.

2\.  \*\*A View é a Fonte da Home:\*\* A Home Page usa `supabase.from('deals\_with\_lowest\_price').select()`. NÃO tente buscar `product\_listings` e agrupar no cliente com `reduce`. O PostgreSQL já faz isso otimizado na View.

3\.  \*\*Supabase Numeric Types:\*\* Ao gerar tipos ou manipular dados de preço do Supabase, assuma sempre que o retorno inicial é `string`. Use `parseFloat` ou a utility `parsePrice` antes de qualquer operação matemática ou renderização com `.toFixed(2)`.

4\.  \*\*Downsampling de Gráficos:\*\* A tabela `price\_history` pode ter milhares de pontos. O componente `PriceHistoryChart` possui uma função `downsampleData`. Mantenha-a. Renderizar +500 pontos no Recharts causa lag severo no navegador.

5\.  \*\*Tratamento de Preços no Histórico:\*\* Ao buscar dados históricos para o gráfico, assegure que a query retorne o `listing\_id` correto. O histórico é por \*\*loja\*\*, não por produto geral.

6\.  \*\*Auth Context:\*\* A sessão do usuário é gerenciada no cliente pelo `AuthContext`. Para buscar dados protegidos em Server Components, use o `createClient` de `lib/supabase/server.ts`.



\*Pronto para a Parte 5: Implementação de Scrapers Reais e Edge Functions para coleta automática.\*

