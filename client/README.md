# Front-end (Vanilla JS + Web Components)

Sem build e sem dependências: o navegador carrega os módulos ES diretamente.
O servidor Go (`../server`) serve estes arquivos e devolve o `index.html` para qualquer rota
que não seja `/api/*`, e o `fc-router` resolve a rota no navegador.

## Estrutura

```
index.html                 Shell da aplicação (<fc-header> + <fc-router>)
favicon.svg
src/
  routes.js                Tabela de rotas (path → página carregada sob demanda)
  components/              Componentes reutilizáveis (fc-button, fc-link, fc-post-card, ...)
  pages/                   Uma página por rota (fc-home-page, fc-blog-page, ...)
  templates/               Classes base de página (ListPage, DetailPage)
  scripts/
    api.js                 Cliente da API
    navigation.js          navigate() e interceptação de cliques em links internos
    format.js              Formatação de datas e tempo de leitura
    theme.js               ThemeManager (script clássico, roda antes do primeiro paint)
  styles/
    global.css, themes.css Estilos do documento e variáveis de tema
    base.js                Folhas de estilo compartilhadas, adotadas dentro dos Shadow DOMs
```

## Convenções

- Cada componente usa Shadow DOM e `adoptedStyleSheets`. CSS global **não** atravessa o shadow root,
  então tipografia/utilitários comuns ficam em `styles/base.js` (`baseStyles` e `pageStyles`).
  As variáveis de tema (`--color-*`) são herdadas normalmente.
- Navegação: componentes chamam `navigate(path)` ou `handleLinkClick(e, href)`; quem altera o
  histórico é só o `fc-router`. Depois de renderizar, ele dispara `route-rendered` no `window`.
- Listas recebem dados por propriedade (`postList.posts = [...]`, `projectGrid.projects = [...]`).

## Rotas

| Caminho       | Página              |
| ------------- | ------------------- |
| `/`           | `fc-home-page`      |
| `/work`       | `fc-work-page`      |
| `/work/:slug` | `fc-project-page`   |
| `/blog`       | `fc-blog-page`      |
| `/blog/:slug` | `fc-post-page`      |
| `/about`      | `fc-about-page`     |
| `/contact`    | `fc-contact-page`   |
| outras        | `fc-not-found-page` |

## API consumida

- `GET /api/posts[?tag=slug]` → `[{ id, slug, title, content, publishedAt, tags }]`
- `GET /api/posts/:slug` → post (o `content` é renderizado como HTML)
- `GET /api/works[?tag=slug]` → `[{ id, slug, title, content, publishedAt, tags, cover? }]`
- `GET /api/works/:slug` → projeto
- `GET /api/content/:key` → `{ key, value, updatedAt }`: textos fixos do site, em HTML
  (ex: `welcome`, exibido na home). Ficam na tabela `site_content`, pensada para o futuro painel admin.
- `GET /api/about` → `{ title, content, updatedAt }`: página about (tabela `about`, sempre uma linha só)
- `GET /api/contacts` → `[{ id, type, label, url, position }]`: links da página de contato, ordenados
  por `position`. O banco só aceita URLs `mailto:` ou `https://`.

Slugs: posts usam um slug legível escrito à mão (`/blog/leaving-react`); projetos usam um ID
aleatório de 6 caracteres `[0-9a-z]` gerado pelo banco (`/work/k3x9a2`), então a URL não muda se o
projeto for renomeado. Ver `server/db/schema.sql`.

Na busca das páginas de listagem, `tag:slug` filtra no servidor; qualquer outro texto filtra pelo título.

## Rodando

Banco (uma vez):

```bash
createdb website
psql -d website -f server/db/schema.sql
psql -d website -f server/db/seed.sql      # opcional: dados de exemplo
```

Banco criado antes de `server/db/schema.sql` existir? Rode as migrações:

- `server/db/migrate-work-slugs.sql`: troca os slugs dos projetos por IDs (muda as URLs dos projetos existentes)
- `server/db/migrate-site-content.sql`: cria a tabela `site_content` com o texto de boas-vindas
- `server/db/migrate-about-contact.sql`: cria as tabelas `about` e `contact_links`

Servidor (configure `server/.env` com `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSLMODE`):

```bash
cd server && go run .   # http://localhost:8080
```
