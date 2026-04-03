# Validação Visual - Agrupamento de Personagens

## ✅ Checklist de Validação

### Fase 1: Verificação Básica
- [ ] Abrir página de edição de história em `comics.org`
- [ ] Verificar se o elemento `#mycharacterslist` existe
- [ ] Confirmar que há personagens listados
- [ ] Confirmar que há pelo menos um personagem com grupo atribuído

### Fase 2: Verificação de Agrupamento
- [ ] Personagens com o mesmo grupo aparecem agrupados
- [ ] Grupos aparecem com indentação visual
- [ ] Nomes de grupos aparecem em **negrito**
- [ ] Personagens sem grupo continuam visíveis
- [ ] Roles (Featured, Supporting, etc.) mantêm a ordem original

### Fase 3: Verificação de Ordenação
- [ ] Grupos dentro de cada role aparecem em ordem alfabética
- [ ] Personagens dentro de cada grupo aparecem em ordem alfabética
- [ ] Personagens sem grupo dentro de um role aparecem alfabeticamente

### Fase 4: Funcionalidade Interativa
- [ ] Clique em nomes de personagens rola até o campo correspondente (≠ comportamento)
- [ ] Clique nos botões de role (F-S-A-V-G-C) funciona corretamente
- [ ] Não há erros no console do browser (F12)
- [ ] Indentação é consistente em toda a lista

### Fase 5: Casos Especiais
- [ ] Personagem com múltiplos grupos: aparece no primeiro grupo
- [ ] Role com todos os personagens sem grupo: todos listados normalmente
- [ ] Role vazio: apenas o título é exibido
- [ ] Nomes de grupos com caracteres especiais: renderizam corretamente

## 🔍 Inspeção por Console

Para debug no console do browser (F12):

```javascript
// Ver se a div existe
$("#mycharacterslist").length

// Ver conteúdo completo
$("#mycharacterslist").html()

// Ver quantos grupos diferentes existem
$("#mycharacterslist").find("span[style*='margin-left:20px'][style*='font-weight:bold']").length

// Ver quantos personagens estão agrupados
$("#mycharacterslist").find("span[style*='margin-left:40px']").length

// Ver logs de debug (devem aparecer no console)
// Procure por "START" para confirmar que o script rodou
```

## 🎯 Testes de Regressão

Confirmar que estas funcionalidades continuam a trabalhar:

1. **Tradução de Personagens**
   - [ ] Botão com ícone de idioma aparece
   - [ ] Ao clicar, traduz termos em inglês para português

2. **Formulário de Edição**
   - [ ] Todos os campos de formulário (role, universe, etc.) funcionam
   - [ ] Salvar/atualizar história ainda funciona
   - [ ] Validação de campos mantém-se

3. **Navegação**
   - [ ] Links internos funcionam corretamente
   - [ ] Scroll para personagem funciona corretamente

## 📊 Dados Esperados

Exemplo de estrutura esperada no HTML gerado:

```html
<div id='mycharacterslist'>
    <span style='font-weight:bold'>Featured</span><br>
    <span style='margin-left:20px; font-weight:bold'>X-Men</span><br>
    <span style='margin-left:40px'>
        <span class='set_role' ...>F</span>-...
        | <span class='characterAnchor' ...>Ciclope</span>
    </span><br>
    <span style='margin-left:40px'>
        <span class='set_role' ...>F</span>-...
        | <span class='characterAnchor' ...>Colossus</span>
    </span><br>
    <!-- mais personagens de X-Men -->
    
    <span style='margin-left:20px; font-weight:bold'>Piratas Siderais</span><br>
    <!-- personagens de Piratas Siderais -->
    
    <span style='margin-left:20px'>
        <span class='set_role' ...>F</span>-...
        | <span class='characterAnchor' ...>Personagem Sem Grupo</span>
    </span><br>
    
    <br><span style='font-weight:bold'>Supporting</span><br>
    <!-- resto dos roles -->
</div>
```

## 🐛 Possíveis Problemas e Soluções

### Problema: Personagens não aparecem agrupados
**Solução:** Verificar se o campo `group_name` no formulário tem valores
```javascript
// No console
$("#id_story_character_revisions-0-group_name").val()
```

### Problema: Grupos aparecem mas sem indentação
**Solução:** Verificar se o CSS é suportado no browser (margin-left)
```javascript
// Testar CSS inline
$("<div style='margin-left:20px'>teste</div>").appendTo("body").offset().left
```

### Problema: Ordem alfabética não funciona
**Solução:** Verificar se há caracteres especiais nos nomes
```javascript
// No console - verificar nomes de grupos
Object.keys({X-Men: [], "A-Force": [], "Fantastic Four": []}).sort()
```

### Problema: Cliques não funcionam
**Solução:** Verificar se o evento `click` foi registrado
```javascript
// No console
$(document).off("click", ".set_role")
$(document).on("click", ".set_role", function() { console.log("clicked"); })
```

## 📋 Relatório de Teste

Formato para documentar resultados:

```
Data do Teste: __________
Hora do Teste: __________
Browser: ________________
URL Testada: ____________

Resultado Geral: [ ] Passou [ ] Falhou

Detalhes:
- Fase 1: [ ] Passou [ ] Falhou
- Fase 2: [ ] Passou [ ] Falhou
- Fase 3: [ ] Passou [ ] Falhou
- Fase 4: [ ] Passou [ ] Falhou
- Fase 5: [ ] Passou [ ] Falhou

Observações:
_________________________________
_________________________________

Problemas Encontrados:
_________________________________
_________________________________

Próximos Passos:
_________________________________
_________________________________
```

---
**Última Atualização:** 2026-04-02

