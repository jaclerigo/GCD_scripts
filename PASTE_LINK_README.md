# Paste Link Button - Feature Documentation

## Funcionalidade

Adicionado botão **Paste Link** à toolbar de Markdown no campo `description` da página de edição de changeset.

Este botão permite colar uma referência Markdown que foi previamente copiada, aplicando automaticamente o formato de referência ao texto selecionado.

### Como Funciona

#### Preparação

1. **Copie uma referência** de qualquer lugar da página (ex: em um resultado de pesquisa)
   - Formato esperado:
   ```
   [Ciclope [Scott Summers] (p. 1969) (Portuguese)][518]
   [518]: https://www.comics.org/character/518/
   ```

2. **Selecione o texto** no campo `description` onde deseja colar a referência
   - Ex: "Ciclope"

3. **Clique no botão "Paste Link"**

#### Resultado

O botão irá:

1. **Ler a clipboard** e extrair:
   - Número de referência (ex: `518`)
   - URL da definição (ex: `https://www.comics.org/character/518/`)

2. **Transformar o texto selecionado**:
   - De: `Ciclope`
   - Para: `[Ciclope][518]`

3. **Adicionar referência ao final do texto**:
   - Se ainda não existir: `[518]: https://www.comics.org/character/518/`

### Exemplo Completo

**Texto original:**
```
... mais poderosos da Marvel: Ciclope ...
```

**Após selecionar "Ciclope" e clicar "Paste Link":**
```
... mais poderosos da Marvel: [Ciclope][518] ...
[518]: https://www.comics.org/character/518/
```

### Validações

- ✅ Verifica se existe texto selecionado
- ✅ Verifica se clipboard contém referência válida (padrão `[número]`)
- ✅ Extrai URL da linha de definição `[número]: url`
- ✅ Evita duplicação de referência (não adiciona se já existe no texto)
- ✅ Trata erros de clipboard com feedback ao utilizador

### Tratamento de Erros

| Cenário | Resultado |
|---------|-----------|
| Sem texto selecionado | Botão não executa |
| Clipboard vazio/inválido | Alert: "Clipboard não contém referência válida" |
| Sem permissão de clipboard | Alert: "Erro ao ler clipboard" |
| Referência duplicada | Não adiciona segunda vez |

### Implementação

- **Arquivo**: `GCD_scripts.js`
- **Rota**: `routeHas("changeset")`
- **Seletor**: `textarea[name='description']`
- **Handler**: `.jac-markdown-paste-link` (delegado, namespaced `click.jacMarkdownPasteLink`)
- **API**: `navigator.clipboard.readText()` (suporte moderno)

### Padrões de Referência Aceitos

Formato esperado na clipboard:

```
[texto com descrição][número]
[número]: url
```

Exemplos válidos:
- `[Ciclope [Scott Summers] (p. 1969)][518]\n[518]: https://www.comics.org/character/518/`
- `[Spider-Man][2]\n[2]: https://www.comics.org/character/2/`
- `[Iron Man (Tony Stark)][99]\n[99]: https://example.com/character/99/`

---

**Data**: 2026-03-30  
**Versão**: 3.0 (com Paste Link button)

