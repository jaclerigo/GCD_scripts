# Referência Técnica - Agrupamento de Personagens por Grupo

## 📌 Resumo Executivo

**Objetivo:** Agrupar personagens por grupo (team/organização) na lista de personagens do formulário de edição de histórias.

**Ficheiro:** `GCD_scripts.js`  
**Linhas Modificadas:** 1236-1321 (aproximadamente)  
**Data:** 2026-04-02  
**Status:** ✅ Implementado  

---

## 🔧 Modificações Técnicas Detalhadas

### 1. Captura de Dados do Grupo (Linhas 1236-1244)

**O quê:** Extração do campo `group_name` do formulário para cada personagem

**Como:**
```javascript
let $groupSelect = $("#id_story_character_revisions-" + $ID + "-group_name");
let $aGroup = ['Group', ''];
if ($groupSelect.length > 0) {
    let $groupValues = $groupSelect.val();
    if ($groupValues && $groupValues.length > 0) {
        $aGroup[1] = $groupValues[0]; // Use the first group if multiple
    }
}
```

**Por quê:** O campo pode ter múltiplos grupos selecionados, mas usamos apenas o primeiro para manter a estrutura simples.

**Entrada:** Formulário com `id="id_story_character_revisions-{ID}-group_name"`  
**Saída:** Array `$aGroup = ['Group', 'Nome do Grupo']` ou `['Group', '']`

---

### 2. Estrutura de Dados Atualizada (Linha 1246)

**Antes:**
```javascript
$charactersInSeq[$ID] = ['Personagem', $aName, $aRole, $aFB, $aOG, $aDT, $aNotes];
// Índices:                  [0]          [1]     [2]    [3]   [4]   [5]   [6]
```

**Depois:**
```javascript
$charactersInSeq[$ID] = ['Personagem', $aName, $aRole, $aFB, $aOG, $aDT, $aNotes, $aGroup];
// Índices:                  [0]          [1]     [2]    [3]   [4]   [5]   [6]       [7]
```

**Impacto:** Compatível com código existente. O novo elemento é apenas adicionado.

---

### 3. Nova Função `displayCharactersByRole()` (Linhas 1259-1300)

**Assinatura:**
```javascript
function displayCharactersByRole(roleArray, roleTitle, isFirst)
```

**Parâmetros:**
- `roleArray`: Array com IDs dos personagens do role (ex: `[0, 5, 12]`)
- `roleTitle`: Título do role a exibir (ex: "Featured")
- `isFirst`: Boolean indicando se é o primeiro role (para formatação)

**Lógica Interna:**

1. **Cabeçalho do Role:**
   ```javascript
   if (!isFirst) $("#mycharacterslist").append("<br>");
   $("#mycharacterslist").append("<span style='font-weight:bold'>" + roleTitle + "</span><br>");
   ```

2. **Mapeamento de Grupos:**
   ```javascript
   let groupMap = {};
   let ungroupedChars = [];
   
   roleArray.forEach(function(characterID) {
       let $personagem = $charactersInSeq[characterID][1][1];
       let $group = $charactersInSeq[characterID][7][1]; // Índice 7 = grupo
       
       if ($group && $group !== '') {
           if (!groupMap[$group]) groupMap[$group] = [];
           groupMap[$group].push($personagem);
       } else {
           ungroupedChars.push($personagem);
       }
   });
   ```

3. **Exibição de Grupos:**
   ```javascript
   let sortedGroups = Object.keys(groupMap).sort();
   sortedGroups.forEach(function(groupName) {
       let charsInGroup = groupMap[groupName].sort();
       $("#mycharacterslist").append(
           "<span style='margin-left:20px; font-weight:bold'>" + groupName + "</span><br>"
       );
       // Exibir personagens do grupo com margin-left:40px
   });
   ```

4. **Exibição de Personagens Sem Grupo:**
   ```javascript
   let sortedUngrouped = ungroupedChars.sort();
   sortedUngrouped.forEach(function(personagem) {
       // Exibir com margin-left:20px
   });
   ```

---

### 4. Calls para Cada Role (Linhas 1303-1321)

```javascript
displayCharactersByRole($roleFeatured, "Featured", true);    // isFirst = true
displayCharactersByRole($roleSupporting, "Supporting", false);
displayCharactersByRole($roleAntoganist, "Antagonist", false);
displayCharactersByRole($roleVillain, "Villain", false);
displayCharactersByRole($roleGuest, "Guest", false);
displayCharactersByRole($roleCameo, "Cameo", false);
displayCharactersByRole($rolenone, "none", false);
```

**Nota:** Apenas o primeiro role usa `isFirst = true` para evitar `<br>` no início.

---

## 🗂️ Estrutura de Dados Completa

### Array `$charactersInSeq`

```
$charactersInSeq = {
    "0": ["Personagem", 
          ["Name", "Ciclope"], 
          ["Role", "Featured"],
          ["Flashback", false],
          ["Origin", false],
          ["Death", false],
          ["Notes", ""],
          ["Group", "X-Men"]           // ← NOVO
    ],
    "1": ["Personagem", 
          ["Name", "Wolverine"],
          // ...
          ["Group", "X-Men"]
    ],
    // ...
}
```

### Arrays de Roles

```javascript
$roleFeatured = [0, 1, 5, 12];  // IDs dos personagens Featured
$roleSupporting = [3, 7];
// etc.
```

---

## 🎨 Saída HTML Gerada

```html
<div id="mycharacterslist">
    <span style='font-weight:bold'>Featured</span><br>
    
    <span style='margin-left:20px; font-weight:bold'>Piratas Siderais</span><br>
    <span style='margin-left:40px'>
        <span class='set_role' data-value='3'>F</span>-...
        | <span class='characterAnchor' ...>Ch'od</span>
    </span><br>
    
    <span style='margin-left:20px; font-weight:bold'>X-Men</span><br>
    <span style='margin-left:40px'>
        <span class='set_role' data-value='3'>F</span>-...
        | <span class='characterAnchor' ...>Ciclope</span>
    </span><br>
    
    <span style='margin-left:20px'>
        <span class='set_role' data-value='3'>F</span>-...
        | <span class='characterAnchor' ...>Personagem Solo</span>
    </span><br>
    
    <br><span style='font-weight:bold'>Supporting</span><br>
    <!-- ... mais roles ... -->
</div>
```

---

## 🔗 Dependências e Interações

### jQuery
- `.each()` - iteração de elementos
- `.attr()` - leitura de atributos
- `.val()` - leitura de valores de form
- `.append()` - adição de HTML

### Seletores CSS Utilizados
- `#id_story_character_revisions-{ID}-group_name` - campo de grupo
- `#mycharacterslist` - div de saída
- `.characterAnchor` - links de personagens
- `.set_role` - botões de role

### Funções Existentes que Continuam a Funcionar
- `.characterAnchor` click handler (linha 1332)
- `.set_role` click handler (linha 1342)
- `addBtnNotes()` (linha 1379)

---

## 🚨 Possíveis Pontos de Falha

| Cenário | Causa | Solução |
|---------|-------|---------|
| Personagens não agrupam | Campo `group_name` vazio | Verificar se há grupos no DB |
| Ordem alfabética errada | Nomes com caracteres especiais | Testar com `.sort()` |
| Indentação não visível | CSS margin-left não suportado | Testar em browser antigo |
| Eventos de clique não funcionam | `.set_role` removido? | Verificar seletor |
| Performance lenta | Array muito grande | Considerar paginação |

---

## 📊 Complexidade Computacional

- **Captura de dados:** O(n) onde n = número de personagens
- **Mapeamento:** O(n) + O(g log g) onde g = número de grupos
- **Ordenação:** O(g log g + c log c) onde c = chars por grupo
- **Renderização:** O(n) - uma linha por personagem

**Tempo Total:** O(n) = aceitável

---

## 🔄 Compatibilidade Regressiva

### ✅ Mantido
- Listeners de clique em `.characterAnchor`
- Listeners de clique em `.set_role`
- Formatação dos botões F-S-A-V-G-C
- Debug logging com `debugLog()`
- Ordem dos roles

### ⚠️ Alterado (mas compatível)
- HTML estrutura da saída (mais `<span>` com margin-left)
- Ordem dos personagens (alfabética dentro do grupo)

### ❌ Removido
- Função `listRoles()` (comentada)
- Função `listCharacters()` (comentada)
- Variáveis `$sorter` (ainda declaradas mas não usadas)

---

## 🧪 Casos de Teste

### Teste 1: Agrupamento Básico
- Input: 3 personagens, 2 com grupo "X-Men", 1 sem grupo
- Expected: 2 agrupados sob "X-Men", 1 solitário

### Teste 2: Múltiplos Grupos
- Input: 5 personagens de 3 grupos diferentes
- Expected: 3 seções de grupo, cada com seus personagens

### Teste 3: Ordem Alfabética
- Input: "Wolverine", "Ciclope", "Colossus" em "X-Men"
- Expected: Ordem C, Co, W

### Teste 4: Compatibilidade de Cliques
- Input: Clicar em "F" de "Colossus"
- Expected: Scroll até campo do formulário, seleciona role=3

---

## 📚 Referências

- **Repositório:** GCD_scripts (Tampermonkey)
- **Target Site:** comics.org
- **Route:** `/story/revision/`
- **Elementos:** `#mycharacterslist`, `#id_story_character_revisions-*-group_name`
- **Technology:** jQuery, JavaScript ES5+
- **Upstream:** Tampermonkey userscript com $.ajax

---

**Última Revisão:** 2026-04-02  
**Versão:** 1.0  
**Autor:** AI Assistant (GitHub Copilot)

