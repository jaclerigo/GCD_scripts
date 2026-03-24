# AGENTS.md

## Scope
- This repo is a browser-side customization layer for comics workflows, not a Node/build project.
- Main scripts: `GCD_scripts.js` (enhances `comics.org` pages) and `fandom.js` (extracts Fandom character data).
- `html_GCD_examples/` contains rendered page examples used as reference targets for changes made by the Tampermonkey script (`script_tempermonkey` / `GCD_scripts.js`).

## Tampermonkey Runtime (How `GCD_scripts.js` Is Loaded)
- `GCD_scripts.js` is not bundled; it is fetched remotely and executed by a Tampermonkey userscript.
- Runtime expectation: Tampermonkey injects `jQuery` + `Cookies` via `@require`, then loads `https://concept.clerigo.pt/GCD_scripts.js` with `GM.xmlHttpRequest`.
- Keep this bootstrap aligned with `GCD_scripts.js` IIFE signature `(function ($, Cookies) { ... })(jQuery, Cookies);`.

```javascript
// ==UserScript==
// @name         GCD scripts - Remote!
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  GCD scripts - Remote com jQuery injetado diretamente
// @author       João Clérigo
// @match        https://*.comics.org/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_log
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_info
// @connect      concept.clerigo.pt
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @require      https://clerigo.pt/fw/pro/js/all.js
// @require      https://clerigo.pt/fw/pro/js/duotone-light.js
// @require      https://clerigo.pt/fw/pro/js/duotone-regular.js
// @require      https://clerigo.pt/fw/pro/js/duotone-thin.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Tampermonkey: jQuery detetado, a injetar GCD_scripts.js via GM.xmlHttpRequest...");

    function injectRemoteScript() {
        GM.xmlHttpRequest({
            method: "GET",
            url: "https://concept.clerigo.pt/GCD_scripts.js?v=" + Date.now(),
            onload: function (response) {
                const remoteScriptCode = response.responseText;
                try {
                    const runRemoteScript = new Function('jQuery', 'Cookies', remoteScriptCode);
                    runRemoteScript(window.jQuery, window.Cookies);
                    console.log("Tampermonkey: GCD_scripts.js executado com sucesso.");
                } catch (e) {
                    console.error("Erro ao executar GCD_scripts.js:", e);
                }
            }
        });
    }

    // Espera que jQuery esteja disponível (recomendado por segurança extra)
    function waitForjQuery() {
        if (typeof window.jQuery === 'undefined') {
            console.log("Tampermonkey: a aguardar jQuery...");
            setTimeout(waitForjQuery, 200);
        } else {
            injectRemoteScript();
        }
    }

    waitForjQuery();
})();
```

## Architecture At A Glance
- Both files use IIFE wrappers and jQuery-heavy DOM scripting.
- `GCD_scripts.js` is route-driven: behavior is gated by `window.location.pathname` checks (e.g., `/character/add/`, `/searchNew/`, `/story/revision/`, `/issue/revision/`, `/checklist/`).
- `fandom.js` runs on Fandom character pages, injects helper links/buttons, then normalizes page data into JSON for clipboard export.
- Shared pattern: add UI controls inline, then wire click handlers to mutate form fields or copy formatted text.

## Cross-File Data Flow (Critical)
- Producer: `fandom.js` `#copy` button builds an ordered JSON array with keys like `personagem`, `universo`, `criadores`, `primeira_aparicao`, optional `morte`.
- Transport: clipboard text (`document.execCommand('copy')` in `fandom.js`; `navigator.clipboard.readText()` in `GCD_scripts.js`).
- Consumer: `GCD_scripts.js` handlers `#paste_fandom` and `#add_fandom` parse the same positional schema (`obj[0]..obj[8]`) and populate `#id_*` form fields.
- If you change payload shape in `fandom.js`, update both consumers in `GCD_scripts.js` together.

## Developer Workflows
- No build/test tooling is present in repo root (no `package.json`, no test runner config detected).
- Typical workflow is edit script -> reload userscript/browser context -> validate on target pages.
- Validate route-specific behavior manually by visiting the exact paths that gate each block.
- Use browser devtools console: scripts log heavily (`console.log`) and logs are part of debugging flow.
- Use `html_GCD_examples/` snapshots to validate DOM selectors and route-specific UI changes before/while testing on live pages.

## Project-Specific Conventions
- Prefer jQuery selectors and direct DOM mutation over abstractions.
- Keep enhancements localized behind pathname guards to avoid cross-page side effects.
- Existing style is mixed PT/EN naming/comments (e.g., `personagem`, `universo`, `criadores`, `notas`); preserve semantics when extending.
- Reused helper conventions in `GCD_scripts.js`: `sortNameAdjust`, `replaceInput2Button`, `addGlobalStyle`, `showFloatingSaveBar`, `addBtnNotes`.
- Persistent client state uses js-cookie keys:
  - `formData` for copy/paste of form fields.
  - `imgCookie` for cover preview in floating panels.

## Integration Points
- External fetch/proxy endpoint: `https://concept.clerigo.pt/proxy.php` (`searchType=issue|creators`) in `fandom.js`.
- Scraping/lookup target: `https://www.comics.org/...` pages via `$.get`/DOM parsing in both scripts.
- Additional outbound links are generated for Fandom/GDQ/GCD searches.

## Safe Extension Playbook
- For new UI actions on `comics.org`, add logic inside the smallest matching pathname block in `GCD_scripts.js`.
- For new copied metadata, keep backward compatibility or version the payload; current parser assumes fixed index positions.
- Reuse existing copy-to-clipboard style where possible; many features depend on plain-text markdown-like outputs.
- When adjusting revision-page UX, test interactions with `showFloatingSaveBar()` and role/anchor controls to avoid duplicate handlers.
