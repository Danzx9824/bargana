Aqui está o `README.md` profissional para o repositório do Bargana, pronto para ser copiado e colado na raiz do seu projeto.

---

```markdown
<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</div>

<br />

<div align="center">
  <h1>🎮 Bargana</h1>
  <p><strong>A Plataforma Premium de Monitoramento de Ofertas Gamer</strong></p>
  <p>Inspirado em SteamDB, GG.deals e IsThereAnyDeal. Nunca pague a mais por um jogo.</p>
</div>

<br />

## 📖 Sobre o Projeto

O **Bargana** é um agregador e monitor de ofertas gamer de nova geração. Com uma identidade visual escura e acentos dourados (#D4AF37), a plataforma foi construída para oferecer uma experiência sofisticada, confiável e de alta performance. 

Diferente de lojas virtuais comuns, o Bargana não vende produtos: ele monitora o mercado, rastreia o histórico de preços por loja e alerta o usuário quando o jogo atinge o menor preço histórico ou um valor desejado.

### ✨ Funcionalidades Principais

- 🔥 **Home Agregada:** Visualização das melhores ofertas, agrupadas automaticamente por menor preço.
- 📈 **Histórico de Preços:** Gráfico interativo estilo SteamDB com downsampling para milhares de pontos, filtro por período e por loja.
- 🏪 **Comparação entre Lojas:** Veja Steam, GOG, Amazon, KaBuM! e outras lado a lado em tempo real.
- 🔔 **Alertas de Preço:** Defina um preço-alvo e seja notificado quando a oferta for atingida (com proteção anti-spam).
- ❤️ **Lista de Desejos (Wishlist):** Salve seus jogos favoritos com UI otimista e atualizações em tempo real.
- 🔐 **Autenticação Completa:** Login via E-mail/Senha, Google e Discord com persistência de sessão via SSR.
- 🛡️ **Segurança (RLS):** Row Level Security no banco garante que cada usuário acesse apenas seus próprios dados.
- 🚀 **Server-First (ISR):** Renderização no servidor e cache inteligente para máxima velocidade e SEO.

---

## 🛠️ Stack Utilizada

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Components, ISR)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [TailwindCSS](https://tailwindcss.com/) (Tema customizado Dark/Gold)
- **Banco de Dados & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, GoTrue, RLS)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Notificações:** [Sonner](https://sonner.emilkowal.dev/)

---

## 🚀 Começando (Instalação Local)

Siga os passos abaixo para rodar o projeto na sua máquina.

### Pré-requisitos
- Node.js 18+ instalado
- Uma conta no [Supabase](https://supabase.com/)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/bargana.git
   cd bargana
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto (veja a seção abaixo).

4. **Rode o projeto:**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000` no navegador.

---

## 🗄️ Configuração do Supabase

O Bargana depende fortemente do Supabase. Siga esta ordem para configurar o banco:

1. Crie um novo projeto no Supabase.
2. Vá em **SQL Editor**.
3. Execute os scripts SQL na seguinte ordem (os arquivos estão na pasta `/supabase` do projeto):
   - Execute `schema.sql`: Cria as tabelas, relações, triggers e políticas RLS.
   - Execute `optimizations.sql`: Cria a View de agregação de preços, índices compostos para o gráfico e constraints de segurança.
   - Execute `seed.sql` (Opcional): Popula o banco com dados de demonstração (Hollow Knight, Celeste, etc).
4. Vá em **Authentication > URL Configuration** e adicione `http://localhost:3000` em **Site URL** e **Redirect URLs**.
5. Vá em **Authentication > Providers** e ative **Google** e **Discord** com suas chaves de desenvolvedor.

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto e preencha com os dados do seu projeto Supabase:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<seu-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>

# URL do Site (Usada para OAuth e Sitemap)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **Importante:** Para produção na Vercel, troque `NEXT_PUBLIC_SITE_URL` para a sua URL real (ex: `https://bargana.com.br`) tanto nas variáveis da Vercel quanto no painel do Supabase.

---

## 🌐 Deploy na Vercel

O Bargana é otimizado para deploy na Vercel.

1. Faça push do código para o GitHub.
2. Vá para a [Vercel](https://vercel.com/) e importe o repositório.
3. Na seção de variáveis de ambiente, adicione todas as variáveis do `.env.local`, alterando a `NEXT_PUBLIC_SITE_URL` para a URL de produção que a Vercel gerou.
4. Clique em **Deploy**.
5. Lembre-se de adicionar a URL de produção no Supabase em **Authentication > URL Configuration > Redirect URLs**.

---

## 📁 Estrutura de Pastas

```text
bargana/
├── app/                      # Rotas do Next.js (App Router)
│   ├── auth/callback/        # Rota API para redirecionamento OAuth
│   ├── dashboard/            # Dashboard do usuário
│   ├── login/                # Tela de Login/Cadastro
│   ├── product/[slug]/       # Página individual do produto (RSC)
│   ├── profile/              # Perfil e contas conectadas
│   ├── wishlist/             # Lista de desejos
│   ├── error.tsx             # Error Boundary Global
│   ├── not-found.tsx         # Página 404
│   ├── layout.tsx            # Layout raiz (Providers)
│   ├── page.tsx              # Home Page (RSC com ISR)
│   └── sitemap.ts            # Sitemap dinâmico
├── components/               # Componentes reutilizáveis
│   ├── product/              # Componentes de produto (Gráfico, Comparação)
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── OfferCard.tsx
├── context/                  # Provedores de estado global (Client)
│   ├── AuthContext.tsx        # Autenticação e Sessão
│   └── WishlistContext.tsx    # Lista de desejos (UI Otimista)
├── lib/                      # Configurações, Supabase clients, Scrapers
├── types/
│   └── database.ts           # Tipos do Supabase
└── supabase/                 # Scripts SQL de criação e seed
```

---

## 🗺️ Roadmap Futuro

Veja o que está planejado para as próximas versões do Bargana:

- [ ] **Scrapers Reais:** Implementação da coleta de dados usando APIs oficiais (Steam, Epic) e web scraping (KaBuM!, Terabyte) via Vercel Cron + Supabase Edge Functions.
- [ ] **Notificações Push/E-mail:** Disparo automático de e-mails quando a tabela `price_alerts` atinge o preço alvo.
- [ ] **Sincronização de Contas:** Importar lista de desejos diretamente da Steam/Xbox/PSN via OAuth.
- [ ] **Expansão Regional:** Suporte a múltiplas moedas e preços regionais (ex: ARS, USD, EUR).
- [ ] **Aplicativo Mobile:** Versão nativa com React Native / Expo para alertas instantâneos no celular.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  Feito com 💛 e ☕ por desenvolvedores, para gamers.
</div>
```