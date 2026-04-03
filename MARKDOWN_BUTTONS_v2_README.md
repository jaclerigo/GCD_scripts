# Markdown Buttons para Changeset / Character Description v2.1

## Funcionalidade

Adicionado suporte a botões de ferramentas nos seguintes campos:

- `textarea[name='description']` em páginas de changeset (`/changeset/{numero}/edit/`)
- `textarea[name='notes']` em páginas de changeset (`/changeset/{numero}/edit/`)
- `textarea[name='description']` em `https://www.comics.org/character/add/`

### Botões Disponíveis

1. **Bold** - Envolve texto selecionado com `**`
2. **Italic** - Envolve texto selecionado com `*`
3. **Search** - Abre nova janela com pesquisa da substring selecionada

### Como Usar

#### Botão Bold (Negrito)

**Com texto selecionado:**
1. Selecione um trecho de texto no campo `description`
2. Clique em **Bold**
3. Resultado: `**texto**`

**Sem texto selecionado:**
1. Coloque o cursor na posição desejada
2. Clique em **Bold**
3. Resultado: `****` (pronto para edição, cursor no meio)

#### Botão Italic (Itálico)

**Com texto selecionado:**
1. Selecione um trecho de texto no campo `description`
2. Clique em **Italic**
3. Resultado: `*texto*`

**Sem texto selecionado:**
1. Coloque o cursor na posição desejada
2. Clique em **Italic**
3. Resultado: `**` (pronto para edição, cursor no meio)

#### Botão Search (Pesquisa)

**Com texto selecionado:**
1. Selecione um trecho de texto no campo `description`
2. Clique em **Search**
3. Resultado: Abre nova janela em `https://www.comics.org/searchNew/?q={substring}`

**Sem texto selecionado ou whitespace:**
- O botão não funciona (requer texto não-vazio)

### Implementação

- **Arquivo**: `GCD_scripts.js`
- **Rotas**: `routeHas("changeset")` e `routeIs('/character/add/')`
- **Seletores**: `textarea[name='description']`, `textarea[name='notes']`
- **Handlers**: Delegados e idempotentes (namespaced com `.jacMarkdownBold`, `.jacMarkdownItalic`, `.jacMarkdownSearch`)
- **Guarda**: `data-target-name` + wrapper `.jac-markdown-field` para evitar reinjeção de toolbar em reexecução
- **Layout**: toolbar forçada para aparecer por cima do campo, dentro de um wrapper vertical `.jac-markdown-field`

### Código-Chave

```javascript
// Markdown buttons for supported textareas
getMarkdownToolbarTargets().each(function () {
	var $textarea = $(this);
	var $wrapper = getMarkdownFieldWrapper($textarea);
	var $toolbar = createMarkdownToolbar().attr("data-target-name", $textarea.attr("name"));
	$wrapper.prepend($toolbar);
	
	// Bold handler
	$(document).off("click.jacMarkdownBold", ".jac-markdown-bold").on("click.jacMarkdownBold", ".jac-markdown-bold", function (e) {
		// Wrap selected text with ** or insert empty ** at cursor
	});
	
	// Italic handler
	$(document).off("click.jacMarkdownItalic", ".jac-markdown-italic").on("click.jacMarkdownItalic", ".jac-markdown-italic", function (e) {
		// Wrap selected text with * or insert empty * at cursor
	});
	
	// Search handler
	$(document).off("click.jacMarkdownSearch", ".jac-markdown-search").on("click.jacMarkdownSearch", ".jac-markdown-search", function (e) {
		// Open new window with searchNew URL
		var searchUrl = 'https://www.comics.org/searchNew/?q=' + encodeURIComponent(selected.trim());
		window.open(searchUrl, '_blank');
	});
}
```

### Exemplos de Resultado

#### Bold
**Input**: `"Hello world"` + seleção + click Bold  
**Output**: `"Hello **world**"`

#### Italic
**Input**: `"Lorem ipsum"` + seleção + click Italic  
**Output**: `"Lorem *ipsum*"`

#### Search
**Input**: `"John Smith"` + seleção + click Search  
**Output**: Nova janela abre com URL `https://www.comics.org/searchNew/?q=John%20Smith`

---

**Data**: 2026-04-01  
**Versão**: 2.1 (changeset notes + character/add description + topo do campo)

