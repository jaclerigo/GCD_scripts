# Agrupamento de Personagens por Grupo

## Descrição da Mudança

Foi implementada a funcionalidade de agrupamento de personagens por grupo (quando disponível) na lista `#mycharacterslist` do formulário de edição de histórias.

## O Que Mudou

### 1. **Captura de Informações de Grupo**
- Linha 1236-1246: Adicionado código para capturar o campo `group_name` de cada personagem do formulário
- Os grupos são armazenados no array `$charactersInSeq` como o 8º elemento (`$aGroup`)

### 2. **Nova Lógica de Exibição**
- Linhas 1258-1297: Substituída a função anterior que listava personagens diretamente
- Implementada nova função `displayCharactersByRole(roleArray, roleTitle)` que:
  - Agrupa personagens por grupo dentro de cada role (Featured, Supporting, etc.)
  - Ordena alfabeticamente os grupos
  - Ordena alfabeticamente os personagens dentro de cada grupo
  - Exibe personagens sem grupo separadamente no final de cada role

### 3. **Formatação da Saída**
- Personagens agrupados recebem indentação para melhor visualização:
  - Título do Role: sem indentação (ex: "Featured")
  - Nome do Grupo: indentado com 20px (ex: "X-Men")
  - Personagens: indentados com 40px
  - Personagens sem grupo: indentados com 20px

## Estrutura da Saída

```
Featured
  X-Men:
    F-S-A-V-G-C | Ciclope
    F-S-A-V-G-C | Colossus
    F-S-A-V-G-C | Ninfa
    ...
  Piratas Siderais:
    F-S-A-V-G-C | Ch'od
    F-S-A-V-G-C | Corsário
    ...
  Personagem Sem Grupo
    F-S-A-V-G-C | Nome do Personagem

Supporting
  ...
```

## Comportamento

1. **Se um personagem tem grupo(s)**: É exibido sob o nome do seu grupo (primeiro grupo se tiver múltiplos)
2. **Se um personagem não tem grupo**: É exibido na secção ungrouped do seu role
3. **Ordem**: 
   - Roles mantêm a ordem original (Featured → Supporting → Antagonist → Villain → Guest → Cameo → none)
   - Grupos dentro de cada role são ordenados alfabeticamente
   - Personagens dentro de cada grupo são ordenados alfabeticamente

## Compatibilidade

- A funcionalidade de clique nos botões de role (F-S-A-V-G-C) continua funcionando normalmente
- Os anchorlinks para scroll também continuam funcionando
- Toda a interface permanece intacta, apenas a organização visual foi alterada

## Teste

Para verificar se está funcionando:
1. Abra uma página de edição de história em `comics.org`
2. Adicione personagens que façam parte de grupos diferentes
3. Verifique se a lista `#mycharacterslist` agrupa os personagens corretamente por grupo

## Detalhes Técnicos

### Ficheiro Modificado
- `GCD_scripts.js` (linhas 1236-1321)

### Mudanças Específicas

1. **Linhas 1236-1244**: Captura do valor do campo `group_name`
   - Lê o select do grupo do formulário
   - Se existem múltiplos grupos, usa o primeiro
   - Armazena no array `$aGroup`

2. **Linhas 1259-1300**: Nova função `displayCharactersByRole(roleArray, roleTitle, isFirst)`
   - Recebe um array de IDs de personagens de um role específico
   - Mapeia personagens por grupo
   - Ordena alfabeticamente grupos e personagens
   - Gera HTML com indentação apropriada

3. **Linhas 1303-1321**: Chamadas da função para cada role
   - Primeiro role (`Featured`) com `isFirst=true`
   - Restantes roles com `isFirst=false` para adicionar quebra de linha

### Indentação CSS
- Role Title: `font-weight:bold` (sem indentação)
- Group Name: `margin-left:20px; font-weight:bold`
- Characters in Group: `margin-left:40px`
- Ungrouped Characters: `margin-left:20px`

