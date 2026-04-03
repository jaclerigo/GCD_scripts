# Markdown Toolbar - Referência Completa

## Localização

Páginas suportadas:

- `https://www.comics.org/changeset/{numero}/edit/`
  - `textarea[name='description']`
  - `textarea[name='notes']`
- `https://www.comics.org/character/add/`
  - `textarea[name='description']`

Em todos os casos, a toolbar aparece no topo do campo, dentro de um wrapper vertical `.jac-markdown-field`.

## Botões Disponíveis

### 1. Bold (**texto**)
- **Ícone**: `fa-duotone fa-bold`
- **Com seleção**: Envolve texto com `**`
  - Input: `hello world` (seleção: `world`)
  - Output: `hello **world**`
- **Sem seleção**: Insere `****` pronto para editar
  - Output: `****` (cursor no meio)

---

### 2. Italic (*texto*)
- **Ícone**: `fa-duotone fa-italic`
- **Com seleção**: Envolve texto com `*`
  - Input: `hello world` (seleção: `world`)
  - Output: `hello *world*`
- **Sem seleção**: Insere `**` pronto para editar
  - Output: `**` (cursor no meio)

---

### 3. Search 🔍
- **Ícone**: `fa-duotone fa-search`
- **Com seleção**: Abre nova janela de pesquisa
  - URL: `https://www.comics.org/searchNew/?q={substring}`
  - Ex: `https://www.comics.org/searchNew/?q=Spider-Man`
- **Sem seleção ou whitespace**: Não executa

---

### 4. Paste Link 🔗
- **Ícone**: `fa-duotone fa-link`
- **Função**: Cola referência Markdown do clipboard
- **Com seleção**: Aplica formato de referência
  - Lê: `[Ciclope [Scott Summers]...][518]\n[518]: https://www.comics.org/character/518/`
  - Transforma seleção: `Ciclope` → `[Ciclope][518]`
  - Adiciona ao final: `[518]: https://www.comics.org/character/518/`
- **Sem seleção**: Não executa
- **Sem referência válida**: Mostra alert informativo

---

## Fluxo de Trabalho Recomendado

### Cenário 1: Adicionar Negrito e Itálico

1. Escrever texto no campo suportado (`description` ou `notes`)
2. Selecionar palavra importante
3. Clicar **Bold** e/ou **Italic**
4. Continuar edição

### Cenário 2: Pesquisar Referência

1. Escrever nome parcial no campo suportado (`description` ou `notes`)
2. Selecionar o nome
3. Clicar **Search** para abrir pesquisa em nova janela
4. Copiar referência completa dos resultados

### Cenário 3: Inserir Referência Markdown

1. Copiar referência de resultado de pesquisa (já na clipboard)
2. Escrever nome do personagem/conceito no campo suportado (`description` ou `notes`)
3. Selecionar nome
4. Clicar **Paste Link**
5. Referência automática aplicada com link

---

## Handlers Idempotentes

Todos os handlers utilizam namespace + `.off().on()` para evitar duplicate bindings em reexecução:

- `.jacMarkdownBold` - Bold button
- `.jacMarkdownItalic` - Italic button
- `.jacMarkdownSearch` - Search button
- `.jacMarkdownPasteLink` - Paste Link button

## CSS Classes

- `.jac-markdown-toolbar` - Container da toolbar
- `.jac-markdown-field` - Wrapper vertical que mantém toolbar acima do textarea
- `.jac-markdown-bold` - Botão Bold
- `.jac-markdown-italic` - Botão Italic
- `.jac-markdown-search` - Botão Search
- `.jac-markdown-paste-link` - Botão Paste Link

---

**Data**: 2026-04-01  
**Versão**: 3.1 (changeset notes + character/add description + layout vertical)

