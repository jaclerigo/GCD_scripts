// GCD_scripts.js

(function ($, Cookies) {
	$(document).ready(function () {

		console.log("GCD_scripts.js iniciado com jQuery passado por argumento.");
		'use strict';

		var pathname              = window.location.pathname; // Returns path only (/path/example.html)
		var url                   = window.location.href; // Returns full URL (https://example.com/path/example.html)
		var origin                = window.location.origin; // Returns base URL (https://example.com)

		function routeIs(route) {
			return pathname === route;
		}

		function routeHas(segment) {
			return pathname.indexOf(segment) !== -1;
		}

		function routeMatch(regex) {
			return regex.test(pathname);
		}

		var page_is_add_character = routeHas("/character/add/");

		console.log("PATHNAME", pathname);

		$("nav > div:nth-child(3)")
			.prepend("<button class='btn hover:bg-blue-700'><a href='/group/add/' style='color: white'><i class='fa-duotone fa-users'></i> Add Group</a></button>")
			.prepend("<button class='btn  hover:bg-blue-700 '><a href='/character/add/' style='color: white'><i class='fa-duotone fa-mask'></i> Add Character</a></button>");

		$("#id_q")
			.after("<button type='button' id='btnAddGroup'><i class='fa-duotone fa-users'></i></button>")
			.after("<button type='button' id='btnAddCharacter'><i class='fa-duotone fa-mask'></i></button>");

		$("#btnAddCharacter").css("cursor", "pointer").click(function () {
			let $nome            = $("#id_q").val();
			window.location.href = '/character/add/?character_name=' + $nome;
		});

		$("#btnAddGroup").css("cursor", "pointer").click(function () {
			let $nome            = $("#id_q").val();
			window.location.href = '/group/add/?character_name=' + $nome;
		});

		// this will only add the buttons to this pages //

		// Expressão regular para verificar o formato "/character/[número]/"
		var regex = /\/character\/\d+\//;

		// Verifica se a regex corresponde à pathname
		var isCharacterPage = routeMatch(regex);

		if (isCharacterPage) {
			let personagem = $("H1.item_id > div").text();
			let link       = `<a href='https://marvel.fandom.com/wiki/Special:Search?query=${personagem}' target='_blank'>FD</a> <a href='http://www.guiadosquadrinhos.com/personagens/${personagem}' target='_blank'>GDQ</a>`;
			$("H1.item_id").append(" - " + link);
		}

		// if (pathname == '/character/add/' || pathname == '/group/add/' || pathname.includes("changeset")) {//
		if (routeIs('/character/add/') || routeIs('/group/add/') || $('input[name="character_name_revisions-0-name"]').length) {

			const queryString    = window.location.search;
			const urlParams      = new URLSearchParams(queryString);
			const character_name = urlParams.get('character_name');
			$("#id_notes").css("height", "350px");

			if (character_name !== '' && character_name !== null) {
				$("#id_name").val(character_name);
				$("#id_character_name_revisions-0-name").val(character_name);
			}

			var $form = $("form"); // storing the form element in a variable //
			$(".textinput").css("width", "400px");

			$("table.editing").first().css("display", "inline-block")
				.prepend('<button type="button" id="copy" class="btn-blue-editing inline"><i class="fa-duotone fa-copy" style="color: blue"></i> Copy Data</button>' +
					'<button type="button" id="paste" class="btn-blue-editing inline"><i class="fa-duotone fa-paste"  style="color: blue"></i> Paste Data</button>' +
					'<textarea style="display: none;" id="pasteArea"></textarea>' +
					'<button type="button" id="paste_fandom" class="btn-blue-editing inline"><i class="fa-duotone fa-paste"  style="color: blue"></i> Paste FANDOM</button>' +
					'<button type="button" id="add_fandom" class="btn-blue-editing inline"><i class="fa-duotone fa-paste"  style="color: blue"></i> Add FANDOM</button>');

			// Código para colar os dados da área de transferência em um array
			$("#paste_fandom").click(async function () {
				// Lê o texto colado da área de transferência
				let text = await navigator.clipboard.readText();
				console.log("Os dados colados: " + text);

				// Verifica se a string não está vazia antes de tentar fazer o parsing
				if (text.trim() === "") {
					console.log("Os dados colados estão vazios.");
					return;
				}

				// Set the text of the textarea
				$("#pasteArea").val(JSON.parse(text));

				setTimeout(function () {

					const text = $("#pasteArea").val();
					const obj  = JSON.parse(text);

					console.log("A: ", text);
					console.log("B: ", obj);

					const characterName    = obj[0].personagem;
					const universe         = obj[1].universo;
					const heroi            = obj[2].heroi;
					const creators         = obj[3].criadores;
					const year             = obj[4].ano;
					const origin           = obj[5].origin;
					const affiliation      = obj[6].affiliation;
					const first_appearance = obj[7].primeira_aparicao;
					const death            = obj[8] ? obj[8].morte : "";

					let disambiguation = universe;
					if (heroi != characterName) {
						disambiguation += '; ' + heroi;
					}
					if (origin != '') {
						disambiguation += '; ' + origin;
					}
					if (affiliation != '') {
						disambiguation += '; ' + affiliation;
					}

					let creatorsInfo;
					// Verifica se obj[3] existe e se obj[3].criadores existe
					if (obj[3] && obj[3].criadores) {
						const creators = obj[3].criadores;

						// Extrai os nomes dos criadores
						const names = creators.map((creator) => creator.name);

						// Extrai os links dos criadores
						const links = creators.map((creator) => creator.link);

						// Formata a string com os nomes dos criadores
						creatorsInfo = "Created by ";
						if (names.length === 1) {
							creatorsInfo += names[0]; // Se houver apenas um criador, não precisa de vírgula e espaço
						}
						else {
							creatorsInfo += names.slice(0, -1).join(", ") + " and " + names.slice(-1); // Usa vírgula + espaço entre os nomes, exceto o último que usa " and "
						}

						// Formata a string com os links dos criadores em parágrafos separados
						const linksInfo = links.join("\n");

						// Combina as informações de nomes e links
						creatorsInfo = creatorsInfo + ".\n" + linksInfo;

						console.log("CREATORS: ", creatorsInfo);
					}
					else {
						console.log("Não foram encontrados criadores.");
					}

					let notes = creatorsInfo;
					notes     = notes + "\n\nFirst appearance:\n\n";

					first_appearance.forEach((item) => {
						// Verifica se existe o character, se não existir, não adiciona "as [Character]" na string.
						let characterPart = item.issueCharacter ? `as ${item.issueCharacter} in ` : 'in ';
						notes += `- ${characterPart}${item.issue}\n`;
					});

					if (death != '') {
						notes = notes + "\n- Died in " + death;
					}

					$("#id_character_name_revisions-0-name").val(characterName);
					$("#id_group_name_revisions-0-name").val(characterName);
					$("#id_disambiguation").val(disambiguation);
					$("#id_year_first_published").val(first_appearance[0].issueYear);
					$("#id_notes").text(notes);

					$("#id_language").val(25);

				}, 250);

			});

			$("#add_fandom").click(async function () {
				// Lê o texto colado da área de transferência
				let text = await navigator.clipboard.readText();

				// Verifica se a string não está vazia antes de tentar fazer o parsing
				if (text.trim() === "") {
					console.error("Os dados colados estão vazios.");
					return;
				}

				// Set the text of the textarea
				$("#pasteArea").val(JSON.parse(text));

				setTimeout(function () {

					const text = $("#pasteArea").val();
					const obj  = JSON.parse(text);

					console.log("A: ", text);
					console.log("B: ", obj);

					const characterName    = obj[0].personagem;
					const universe         = obj[1].universo;
					const heroi            = obj[2].heroi;
					const creators         = obj[3].criadores;
					const year             = obj[4].ano;
					const origin           = obj[5].origin;
					const affiliation      = obj[6].affiliation;
					const first_appearance = obj[7].primeira_aparicao;
					const death            = obj[8] ? obj[8].morte : "";

					let disambiguation = universe;
					if (heroi != characterName) {
						disambiguation += '; ' + heroi;
					}
					if (origin != '') {
						disambiguation += '; ' + origin;
					}
					if (affiliation != '') {
						disambiguation += '; ' + affiliation;
					}

					let creatorsInfo;
					// Verifica se obj[3] existe e se obj[3].criadores existe
					if (obj[3] && obj[3].criadores) {
						const creators = obj[3].criadores;

						// Extrai os nomes dos criadores
						const names = creators.map((creator) => creator.name);

						// Extrai os links dos criadores
						const links = creators.map((creator) => creator.link);

						// Formata a string com os nomes dos criadores
						creatorsInfo = "Created by ";
						if (names.length === 1) {
							creatorsInfo += names[0]; // Se houver apenas um criador, não precisa de vírgula e espaço
						}
						else {
							creatorsInfo += names.slice(0, -1).join(", ") + " and " + names.slice(-1); // Usa vírgula + espaço entre os nomes, exceto o último que usa " and "
						}

						// Formata a string com os links dos criadores em parágrafos separados
						const linksInfo = links.join("\n");

						// Combina as informações de nomes e links
						creatorsInfo = creatorsInfo + ".\n" + linksInfo;

						console.log("CREATORS: ", creatorsInfo);
					}
					else {
						console.log("Não foram encontrados criadores.");
					}

					let notes = creatorsInfo;
					notes     = notes + "\n\nFirst appearance:\n\n";

					first_appearance.forEach((item) => {
						// Verifica se existe o character, se não existir, não adiciona "as [Character]" na string.
						let characterPart = item.issueCharacter ? `as ${item.issueCharacter} in ` : 'in ';
						notes += `- ${characterPart}${item.issue}\n`;
					});

					if (death != '') {
						notes = notes + "\n- Died in " + death;
					}

					$("#id_character_name_revisions-0-name").val($("#id_character_name_revisions-0-name").val() + '; ' + characterName);
					$("#id_disambiguation").val($("#id_disambiguation").val() + '; ' + disambiguation);
					$("#id_year_first_published").val(first_appearance[0].issueYear);
					$("#id_notes").text($("#id_notes").text() + '\n\n' + notes);

					$("#id_language").val(25);

				}, 250);

			});

			$("#id_language")
				.after('<button class="btn-blue-editing inline" type="button" value="EN" id="set_EN">EN</button>' +
					'<button class="btn-blue-editing inline" type="button" value="PT" id="set_PT">PT</button>');

			$("#id_disambiguation").after('<button type="button" id="btn_switch_disambiguation" class="btn-blue-editing inline"><i class="fa-duotone fa-arrows-repeat"></i></button>')
				.after('<button type="button" id="btn_send_to_name" class="btn-blue-editing inline"> <i class="fa-duotone fa-angles-up"></i></i></button>')
				.after('<button type="button" id="btn_2pt_disambiguation" class="btn-blue-editing inline"> <i class="fa-duotone fa-solid fa-language"></i></button>');

			$("#id_notes").css("width", "1200px").parent().css("display", "grid").css("grid-template-columns", "1fr 1fr");
			$("#id_notes").after('<div style="width: 200px;"><button class="btn-blue-editing inline" type="button" id="btn_reorder_links" style="padding: 6px;"><i class="fa-duotone fa-arrow-down-arrow-up"></i></button>&nbsp<button class="btn-blue-editing inline" type="button" id="btn_translate" style="padding: 6px;"><i class="fa-duotone fa-language"></i></button></div>');

			$("#set_EN").css("cursor", "pointer").click(function (e) {
				$("#id_language").val("25");
				var $notes = $("#id_notes").val();
				$("#id_notes").val($notes + "Created by \r\nFirst appearance in \r\nDied in ");
			});

			$("#btn_switch_disambiguation").css("cursor", "pointer").click(function (e) {
				let $disambiguationText  = $("#id_disambiguation").val();
				let $disambiguationArray = $disambiguationText.split(',');
				if ($disambiguationArray.length < 2 || $disambiguationArray.length > 3) {
					$disambiguationArray = $disambiguationText.split('/');
				}
				if ($disambiguationArray.length < 2 || $disambiguationArray.length > 3) {
					$disambiguationArray = $disambiguationText.split(';');
				}
				if ($disambiguationArray.length > 2 || $disambiguationArray.length < 3) {
					let $disambiguation = $disambiguationArray[1].trim() + '; ' + $disambiguationArray[0].trim();
					$("#id_disambiguation").val($disambiguation);
				}
			});

			$("#id_disambiguation").focus(function () {
				let text = $(this).val();

				// substitui Earth/Terra-<número>; e opcional "Human;"
				text = text.replace(/(?:Earth-616|Terra-616)(?:-\d+)?;(?:\s*Human;)?/g, 'Marvel;').replace(/Human;\s*/g, '');

				// Remove espaços no início e no final
				text = text.trim();

				$(this).val(text);
			});

			$("#btn_send_to_name")
				.css("cursor", "pointer")
				.on("click", function (e) {
					e.preventDefault();

					var $nameInput   = $("#id_character_name_revisions-0-name");
					var $disambInput = $("#id_disambiguation");

					var oldName   = $nameInput.val();
					var oldDisamb = $disambInput.val();
					var prefixes  = ["Marvel; ", "Terra-616; ", "Earth-616; "];
					var prefix    = "";

					// Detectar qual prefixo existe e removê-lo
					for (var i = 0; i < prefixes.length; i++) {
						if (oldDisamb.indexOf(prefixes[i]) === 0) {
							prefix    = prefixes[i];
							oldDisamb = oldDisamb.substring(prefixes[i].length);
							break;
						}
					}

					// Efetuar a troca dos valores e re-adicionar o prefixo
					$nameInput.val(oldDisamb);
					$disambInput.val(prefix + oldName);
				});

			$("#btn_2pt_disambiguation")
				.css("cursor", "pointer")
				.on("click", function (e) {
					e.preventDefault();

					let $desambigua = $("#id_disambiguation").val();
					$desambigua     = $desambigua.replace(/Earth-(\d+)/g, "Terra-$1");
					$("#id_disambiguation").val($desambigua);
				});

			$("#btn_reorder_links").css("cursor", "pointer").click(function (e) {
				let $notas        = $("#id_notes").val();
				let $arrayOfLines = $notas.split("\n").filter(line => line.trim() !== ""); // Remove linhas totalmente vazias

				let linhaTXT = [];
				let linhaURL = [];
				$arrayOfLines.forEach(function (value) {
					if (value.startsWith("[")) {
						linhaURL.push(value.trim());
					}
					else {
						linhaTXT.push(value.trim());
					}
				});

				// Processamento para garantir que linhas que começam com "-" estejam corretamente agrupadas
				let $notasTXT = linhaTXT.join("\n").replace(/\-\s*\n\-(?!\s*\[)/g, '-\n-');

				// Insere um parágrafo vazio apenas entre a última linha que começa por "-" e a primeira linha de URL
				if ($notasTXT.lastIndexOf("-") > $notasTXT.lastIndexOf("\n") && linhaURL.length > 0) {
					$notasTXT += "\n\n"; // Adiciona dois novos parágrafos para separar
				}

				let $notasURL = linhaURL.join("\n");
				if ($notasURL) $notasTXT += $notasURL + "\n"; // Concatena as URLs apenas se houver

				// Limpeza final para ajustes específicos de strings
				$notasTXT = $notasTXT.replace(/- no Brasil em\s*\n/g, '');
				$notasTXT = $notasTXT.replace(/- em Portugal em\s*\n/g, '');

				// Adiciona um parágrafo em branco após as linhas que começam com "Criado por " e "Primeira aparição"
				$notasTXT = $notasTXT.replace(/Created by .*\n/, '$&\n');
				$notasTXT = $notasTXT.replace(/Criado por .*\n/, '$&\n');
				$notasTXT = $notasTXT.replace(/First appearance.*\n/, '$&\n');
				$notasTXT = $notasTXT.replace(/Primeira aparição.*\n/, '$&\n');

				// Adiciona um parágrafo em branco antes da primeira linha que começa com "["
				$notasTXT = $notasTXT.replace(/\n\[/, '\n\n[');

				// Define o valor final
				$("#id_notes").val($notasTXT.trim());
			});


			$("#set_PT").css("cursor", "pointer").click(function (e) {
				let id_language = $("#id_language").val();

				if (id_language == "25") {
					$("#id_year_first_published").val("");
				}
				$("#id_language").val("90");

				let $notes       = $("#id_notes").val();
				//const textToAdd1 = "\r\n- Primeira aparição original em ";
				const textToAdd1 = "";
				const textToAdd2 = "\r\n- no Brasil em ";
				const textToAdd3 = "\r\n- em Portugal em ";

				// Se o texto a adicionar já não estiver presente, então adiciona-o
				if ($notes.includes("- Primeira aparição original em") || $notes.includes("- First appearance in")) {
					$("#id_notes").val($notes + textToAdd2 + textToAdd3);
				}
				else {
					$("#id_notes").val($notes + textToAdd1 + textToAdd2 + textToAdd3);
				}
			});


			$("#btn_translate").css("cursor", "pointer").click(function (e) {
				var $notes = $("#id_notes").val();
				$notes     = $notes.replace("Created by", "Criado por");
				$notes     = $notes.replace("First appearance and death in", "Primeira aparição e morte original em");
				$notes     = $notes.replace(" and ", " e ");
				$notes     = $notes.replace(/First Appearance/gmi, "Primeira aparição");
				$notes     = $notes.replace(/died in/gmi, "morte em");
				$notes     = $notes.replace(/- As /gmi, "- como ");
				$notes     = $notes.replace(/ in /gmi, " original em ");
				$notes     = $notes.replace("(January ", "(janeiro ").replace("(January ", "(janeiro ");
				$notes     = $notes.replace("(February ", "(fevereiro ").replace("(February ", "(fevereiro ");
				$notes     = $notes.replace("(March ", "(março ").replace("(March ", "(março ");
				$notes     = $notes.replace("(April ", "(abril ").replace("(April ", "(abril ");
				$notes     = $notes.replace("(May ", "(maio ").replace("(May ", "(maio ");
				$notes     = $notes.replace("(June ", "(junho ").replace("(June ", "(junho ");
				$notes     = $notes.replace("(July ", "(julho ").replace("(July ", "(julho ");
				$notes     = $notes.replace("(August ", "(agosto ").replace("(August ", "(agosto ");
				$notes     = $notes.replace("(September ", "(setembro ").replace("(September ", "(setembro ");
				$notes     = $notes.replace("(October ", "(outubro ").replace("(October ", "(outubro ");
				$notes     = $notes.replace("(November ", "(novembro ").replace("(November ", "(novembro ");
				$notes     = $notes.replace("(December ", "(dezembro ").replace("(December ", "(dezembro ");
				$notes     = $notes.replace("Editora Brasil-América [EBAL]", "EBAL");
				$("#id_notes").val($notes);

				let $desambigua = $("#id_disambiguation").val();
				$desambigua     = $desambigua.replace("Earth-616", "Marvel").replace("Earth", "Terra");
				$desambigua     = $("#id_disambiguation").val($desambigua);
			});

			$("#id_notes").blur(function (e) {
				var $notes = $(this).val();
				$notes     = $notes.replace(" [British]", "");
				$notes     = $notes.replace(" [Regular]", "");
				$notes     = $notes.replace(" [Newsstand]", "");
				$notes     = $notes.replace(" [Direct]", "");
				$notes     = $notes.replace(" [Direct Edition]", "");
				$notes     = $notes.replace(" [Regular Edition]", "");
				$notes     = $notes.replace(" [British Edition]", "");
				$("#id_notes").val($notes);
			});

			/* copy button action
			*  #copy is the Copy button ID
			*  input[name='add'] is the submit button for a new character
			*  input[name='submit'] is the submit button when editing a character
			*/
			$("#copy, button[name='add'], input[name='add'], button[name='submit'], input[name='submit']").click(function (e) {
				// this will save the form data, serialized as an array in a cookie named formData
				let $formArray = $form.serializeArray();
				let $exclusoes = ["search_type", "query", "sort", "csrfmiddlewaretokennext", "next", "additional_names_help", "csrfmiddlewaretoken", "character_name_revisions-TOTAL_FORMS", "character_name_revisions-INITIAL_FORMS", "character_name_revisions-MIN_NUM_FORMS", "character_name_revisions-MAX_NUM_FORMS", "character_name_revisions-0-DELETE", "character_name_revisions-1-DELETE", "character_name_revisions-2-DELETE", "character_name_revisions-3-DELETE", "character_name_revisions-0-id", "character_name_revisions-0-character_revision", "character_name_revisions-1-id", "character_name_revisions-1-character_revision", "character_name_revisions-2-id", "character_name_revisions-2-character_revision", "character_name_revisions-3-id", "character_name_revisions-3-character_revision", "oi-externallinkrevision-content_type-object_id-TOTAL_FORMS", "oi-externallinkrevision-content_type-object_id-INITIAL_FORMS", "oi-externallinkrevision-content_type-object_id-MIN_NUM_FORMS", "oi-externallinkrevision-content_type-object_id-MAX_NUM_FORMS", "oi-externallinkrevision-content_type-object_id-0-id", "oi-externallinkrevision-content_type-object_id-0-site", "oi-externallinkrevision-content_type-object_id-0-link", "oi-externallinkrevision-content_type-object_id-0-DELETE"];

				let $formArrayFinal = [];
				$formArray.forEach(function (value, index) {
					let $valor = value.name;
					//console.log("iter:", $valor, "i:", index);
					if ($exclusoes.includes($valor)) {
						//console.log("Removi:", $valor, "i:", index)
						//$formArrayFinal.splice(index, 1)
					}
					else {
						$formArrayFinal.push(value);
					}
				});


				let $formData = JSON.stringify($formArrayFinal);
				Cookies.set('formData', $formArrayFinal, {
					path: '/', expires: 7
				});
				console.log("Copy data from FORM", $formArrayFinal, $formArrayFinal);
			});

			/* paste button action
			*  #paste is the Paste button ID
			*/
			$("#paste").click(function (e) {
				console.log("clicked PASTE");
				// this will get the saved form data from the cookie named formData
				let $form_cookie = Cookies.get('formData');
				//Cookies.remove('formData')
				console.log("form cookie DATA", $form_cookie);
				if (!($form_cookie === 'null' || $form_cookie === undefined || $form_cookie === null)) {
					var $fields   = JSON.parse($form_cookie);
					// this will fill the form with the data that was stored in the cookie
					var exclusoes = ["search_type", "query", "sort", "csrfmiddlewaretokennext", "next", "additional_names_help", "csrfmiddlewaretoken", "character_name_revisions-TOTAL_FORMS", "character_name_revisions-INITIAL_FORMS", "character_name_revisions-MIN_NUM_FORMS", "character_name_revisions-MAX_NUM_FORMS", "character_name_revisions-0-DELETE", "character_name_revisions-1-DELETE", "character_name_revisions-2-DELETE", "character_name_revisions-3-DELETE", "character_name_revisions-0-id", "character_name_revisions-0-character_revision", "character_name_revisions-1-id", "character_name_revisions-1-character_revision", "character_name_revisions-2-id", "character_name_revisions-2-character_revision", "character_name_revisions-3-id", "character_name_revisions-3-character_revision",];
					for (var i = 0; i < $fields.length; i++) {
						var controlName  = $fields[i].name;
						var controlValue = $fields[i].value;

						if (controlName === undefined || exclusoes.includes(controlName)) {
							// console.log("PASTEnot", controlName, controlValue);
						}
						else {
							console.log("PASTAR", controlName, controlValue);
							if (controlName === "universe") {
								$("#id_" + controlName).val(controlValue).trigger('change');
							}
							else if (controlName.includes("is_official_name") && controlValue === "on") {
								$("#id_" + controlName).val(controlValue).attr("checked", true);
							}
							else {
								$("#id_" + controlName).val(controlValue);
								$("#wmd-input-id_" + controlName).val(controlValue);
							}
						}
					}
				}
			});

			sortNameAdjust("id_name", "id_sort_name");
			sortNameAdjust("id_character_name_revisions-0-name", "id_character_name_revisions-0-sort_name");
			sortNameAdjust("id_character_name_revisions-1-name", "id_character_name_revisions-1-sort_name");
			sortNameAdjust("id_character_name_revisions-2-name", "id_character_name_revisions-2-sort_name");
			sortNameAdjust("id_character_name_revisions-3-name", "id_character_name_revisions-3-sort_name");
			sortNameAdjust("id_character_name_revisions-4-name", "id_character_name_revisions-4-sort_name");
			sortNameAdjust("id_character_name_revisions-5-name", "id_character_name_revisions-5-sort_name");

			sortNameAdjust("id_name", "id_sort_name");
			sortNameAdjust("id_group_name_revisions-0-name", "id_group_name_revisions-0-sort_name");
			sortNameAdjust("id_group_name_revisions-1-name", "id_group_name_revisions-1-sort_name");
			sortNameAdjust("id_group_name_revisions-2-name", "id_group_name_revisions-2-sort_name");
			sortNameAdjust("id_group_name_revisions-3-name", "id_group_name_revisions-3-sort_name");
			sortNameAdjust("id_group_name_revisions-4-name", "id_group_name_revisions-4-sort_name");
			sortNameAdjust("id_group_name_revisions-5-name", "id_group_name_revisions-5-sort_name");

			$(".dynamic-form-add > td > a").click(function () {
				sortNameAdjust("id_character_name_revisions-0-name", "id_character_name_revisions-0-sort_name");
				sortNameAdjust("id_character_name_revisions-1-name", "id_character_name_revisions-1-sort_name");
				sortNameAdjust("id_character_name_revisions-2-name", "id_character_name_revisions-2-sort_name");
				sortNameAdjust("id_character_name_revisions-3-name", "id_character_name_revisions-3-sort_name");
				sortNameAdjust("id_character_name_revisions-4-name", "id_character_name_revisions-4-sort_name");
				sortNameAdjust("id_character_name_revisions-5-name", "id_character_name_revisions-5-sort_name");

				sortNameAdjust("id_group_name_revisions-0-name", "id_group_name_revisions-0-sort_name");
				sortNameAdjust("id_group_name_revisions-1-name", "id_group_name_revisions-1-sort_name");
				sortNameAdjust("id_group_name_revisions-2-name", "id_group_name_revisions-2-sort_name");
				sortNameAdjust("id_group_name_revisions-3-name", "id_group_name_revisions-3-sort_name");
				sortNameAdjust("id_group_name_revisions-4-name", "id_group_name_revisions-4-sort_name");
				sortNameAdjust("id_group_name_revisions-5-name", "id_group_name_revisions-5-sort_name");
			});

		}

		if (routeIs('/searchNew/')) {

			$("a").filter(function () {
				return $(this).text() === "brand group";
			}).before('<i class="fa-duotone fa-copyright" style="color: blue"></i> ');
			$("a").filter(function () {
				return $(this).text() === "brand emblem";
			}).before('<i class="fa-duotone fa-copyright" style="color: blue"></i> ');

			$("a").filter(function () {
				return $(this).text() === "indicia publisher";
			}).before('<i class="fa-duotone fa-shield-alt" style="color: blue"></i> ');
			$("a").filter(function () {
				return $(this).text() === "publisher";
			}).before('<i class="fa-duotone fa-print" style="color: blue"></i> ');

			$("a").filter(function () {
				return $(this).text() === "received award";
			}).before('<i class="fa-duotone fa-award" style="color: blue"></i> ');
			$("a").filter(function () {
				return $(this).text() === "award";
			}).before('<i class="fa-duotone fa-medal" style="color: blue"></i> ');

			$("a").filter(function () {
				return $(this).text() === "character";
			}).before('<i class="fa-duotone fa-mask" style="color: blue"></i> ');
			$("a").filter(function () {
				return $(this).text() === "story";
			}).before('<i class="fa-duotone fa-book-open" style="color: blue"></i> ');
			$("a").filter(function () {
				return $(this).text() === "issue";
			}).before('<i class="fa-duotone fa-book" style="color: blue"></i> ');
			$("a").filter(function () {
				return $(this).text() === "series";
			}).before('<i class="fa-duotone fa-book-reader" style="color: blue"></i> ');
			$("a").filter(function () {
				return $(this).text() === "feature";
			}).before('<i class="fa-duotone fa-burn" style="color: blue"></i> ');
			$("a").filter(function () {
				return $(this).text() === "group";
			}).before('<i class="fa-duotone fa-users" style="color: blue"></i> ');

			$("a").filter(function () {
				return $(this).text() === "creator";
			}).before('<i class="fa-duotone fa-user-edit" style="color: blue"></i> ');
			$("a").filter(function () {
				return $(this).text() === "creator non comic work";
			}).before('<i class="fa-duotone fa-marker" style="color: blue"></i> ');
			$("a").filter(function () {
				return $(this).text() === "creator art influence";
			}).before('<i class="fa-duotone fa-grin-hearts" style="color: blue"></i> ');

			$("div.left > table > tbody > tr > td:nth-child(2)").each(function () {
				console.log("TEXTO1: ", $(this).text());
				$(this).prepend('<button type="button" class="btn_copy_txt_issue" title="Copy Text"><i class="fa-duotone fa-copy" style="color: blue"></i></button> ');
				$(this).css('white-space', 'nowrap');
			});

			$("div.left > table.listing > tbody > tr > td")
				.filter(function () {
					return $(this).text() === "[CREATOR]";
				})
				.prepend('<button type="button" class="btn_copy_txt_issue" title="Copy Text"><i class="fa-duotone fa-copy" style="color: blue"></i></button> ')
				.css('white-space', 'nowrap');

			$("div.left > table.listing > tbody > tr > td")
				.filter(function () {
					return $(this).text() === "[CHARACTER]";
				})
				.prepend('<button type="button" class="btn_copy_txt_character" title="Copy Text"><i class="fa-duotone fa-copy" style="color: blue"></i></button> ')
				.css('white-space', 'nowrap');

			$("div.left > table.listing > tbody > tr > td")
				.filter(function () {
					return $(this).text() === "[STORY]";
				})
				.prepend('<button type="button" class="btn_copy_txt_story_issue" title="Copy Text"><i class="fa-duotone fa-copy" style="color: blue"></i></button> ')
				.css('white-space', 'nowrap');

			$(".btn_copy_txt_issue").click(function (e) {
				var elemento = $(this).siblings("a").first().text();
				var nobr     = elemento.replace(/(\r\n|\n|\r)/gm, "");
				var nodb     = nobr.replace(/\s{2,}/g, ' ');
				var txt      = nodb.trim();
				var url      = 'https://www.comics.org' + $(this).siblings("a").attr("href");

				console.log("TEXTO:", txt);

				let regex1  = /\d+(?=(\/))/g;
				let href    = url;
				let myRefID = href.match(regex1)[0];

				let regex2  = /\(([^)]*)\)[^(]*$/;
				let dataPub = txt.match(regex2)[0];

				txt = txt.replace(dataPub, '');
				txt = txt.trim();
				txt = '[' + txt + ' ' + dataPub + '][' + myRefID + '] \n[' + myRefID + ']: ' + url;
				console.log("M", txt);


				var dummy = document.createElement("textarea");
				// to avoid breaking orgain page when copying more words
				// cant copy when adding below this code
				// dummy.style.display = 'none'
				document.body.appendChild(dummy);
				//Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". â Eduard
				dummy.value = txt;
				dummy.select();
				document.execCommand("copy");
				document.body.removeChild(dummy);
			});

			$(".btn_copy_txt_story_issue").click(function (e) {
				var elementoTXT = $(this).parent().next().text();

				var afterTXT = elementoTXT.substr(elementoTXT.indexOf("(from") + 5);
				var elemento = afterTXT;

				var nobr = elemento.replace(/(\r\n|\n|\r)/gm, "");
				var nodb = nobr.replace(/\s{2,}/g, ' ');
				var txt  = nodb.trim();
				var url  = 'https://www.comics.org' + $(this).parent().next().find("a").attr("href");

				let regex1  = /\d+(?=(\/))/g;
				let href    = url;
				let myRefID = href.match(regex1)[0];

				let regex2   = /\(([^)]*)\)[^(]*$/;
				let dataPub1 = txt.match(regex2)[0];
				let dataPub  = dataPub1.slice(0, -1);

				txt = txt.replace(dataPub, '');
				txt = txt.slice(0, -1);
				txt = txt.trim();
				txt = '[' + txt + '][' + myRefID + '] ' + dataPub + '\n[' + myRefID + ']: ' + url;
				console.log("btn_copy_txt_story_issue", txt);


				var dummy = document.createElement("textarea");
				// to avoid breaking orgain page when copying more words
				// cant copy when adding below this code
				// dummy.style.display = 'none'
				document.body.appendChild(dummy);
				//Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". â Eduard
				dummy.value = txt;
				dummy.select();
				document.execCommand("copy");
				document.body.removeChild(dummy);
			});

			$(".btn_copy_txt_character").click(function (e) {
				console.log('aqui');
				var elemento;
				if ($(this.hasClass('cpy_1'))) {
					elemento = $(this).next().text();
				}
				else {
					elemento = $(this).parent().next().text();
				}

				var nobr = elemento.replace(/(\r\n|\n|\r)/gm, "");
				var nodb = nobr.replace(/\s{2,}/g, ' ');
				var txt  = nodb.trim();

				// remove tudo entre parenteses
				const regex = /\([^()]*\)/g;
				const subst = ``;

				// The substituted value will be contained in the result variable
				const resulti = txt.replace(regex, subst);
				const result  = resulti.trim();

				var dummy = document.createElement("textarea");
				// to avoid breaking orgain page when copying more words
				// cant copy when adding below this code
				// dummy.style.display = 'none'
				document.body.appendChild(dummy);
				//Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". â Eduard
				dummy.value = result;
				dummy.select();
				document.execCommand("copy");
				document.body.removeChild(dummy);

				console.log('Substitution result: ', result);
			});

		}

		if (routeHas('/character/') || routeHas('/group/')) {

			$("h3").filter(function () {
				return $(this).text() === "Relations:";
			}).next().addClass("relations_list");
			$("ol.relations_list > li > a").next().before('<button type="button" class="btn_copy_character_name" title="Copy Text"><i class="fa-duotone fa-copy" style="color: blue"></i></button> ');

			$(".btn_copy_character_name").click(function (e) {
				var elemento = $(this).next().text();

				console.log("TEXTO", elemento);

				var nobr = elemento.replace(/(\r\n|\n|\r)/gm, "");
				var nodb = nobr.replace(/\s{2,}/g, ' ');
				var txt  = nodb.trim();

				// remove tudo entre parenteses
				const regex = /\([^()]*\)/g;
				const subst = ``;

				// The substituted value will be contained in the result variable
				const resulti = txt.replace(regex, subst);
				const result  = resulti.trim();

				var dummy = document.createElement("textarea");
				// to avoid breaking orgain page when copying more words
				// cant copy when adding below this code
				// dummy.style.display = 'none'
				document.body.appendChild(dummy);
				//Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". â Eduard
				dummy.value = result;
				dummy.select();
				document.execCommand("copy");
				document.body.removeChild(dummy);

				console.log('Substitution result: ', result);
			});
		}

		if (routeHas('/issue/')) {

			/*
			$(document).tooltip({
				content: function () {
					return $(this).prop('title');
				},
				open: function(e, ui) {
					ui.tooltip.position({
						my: 'left top',
						at: 'right+50 center',
						of: e
					});
				}
			});
			*/

			$(document).on('click', '.trigger', function () {
				$(this).addClass("on");
				$(this).tooltip({
					items     : '.trigger.on', position: {
						my: "left+30 center", at: "right center", collision: "flip"
					}, content: function () {
						return $(this).prop('title');
					},
				});
				$(this).trigger('mouseenter');
			});

			//hide
			$(document).on('click', '.trigger.on', function () {
				$(this).tooltip('close');
				$(this).removeClass("on");
			});

			//prevent mouseout and other related events from firing their handlers
			$(".trigger").on('mouseout', function (e) {
				e.stopImmediatePropagation();
			});

			$('#story_toc').after('<div class="side_section_header">Reprinted Covers</div><div id="jacCovers"></div>');

			$("#control_container").find("a").each(function (e) {
				let aElement = $(this);
				if (!aElement.parent().parent().hasClass('side_section_body') && !aElement.parent().hasClass('single_story_navigation') && !aElement.parent().hasClass('edit_footer') && !aElement.hasClass('link_info_left')) {
					let linkData = aElement.attr('href');
					let textData = aElement.text();

					if (linkData != undefined) {
						if (~linkData.indexOf("/issue/")) {
							let bocados     = linkData.split('/');
							let issueNumber = bocados[2];
							let searchURL   = 'https://www.comics.org/issue/' + issueNumber + '/';
							let coverImgLnk = 'not-found';

							if (bocados[3] != 'cover' && bocados[3] != 'cache') {
								// console.log("BOCADOS", bocados['3']);
								$.get(searchURL, null, function (text) {
									coverImgLnk = $(text).find('.cover_img').attr('src');
									//console.log("ELEMENTO", linkData, issueNumber, searchURL, coverImgLnk);
									$('#jacCovers').prepend('<a href="' + searchURL + '" target="_blank"><img style="width: 100%;" src="' + coverImgLnk + '"></a>');

									aElement.before('<i class="fa-duotone fa-eye tooltip_' + issueNumber + ' trigger" style="cursor: pointer"></i> <button type="button" class="btn_copy_txt_character cpy_1" title="Copy Text"><i class="fa-duotone fa-copy" style="color: blue"></i></button> ');
									$(".tooltip_" + issueNumber).attr('title', '<img src="' + coverImgLnk + '" style="background-color:#000000;border: 2px solid #000000;box-shadow: 5px 5px 15px 5px #000000;">');


								});
							}
						}
					}
				}
			});

			$(document).on('click', ".btn_copy_txt_character", function (e) {
				console.log('aqui');
				var elemento;
				elemento = $(this).next().text();

				var nobr = elemento.replace(/(\r\n|\n|\r)/gm, "");
				var nodb = nobr.replace(/\s{2,}/g, ' ');
				var txt  = nodb.trim();

				// remove tudo entre parenteses
				const regex = /\([^()]*\)/g;
				const subst = ``;

				// The substituted value will be contained in the result variable
				const resulti = txt.replace(regex, subst);
				const resulta = resulti.replace(/\s\s+/g, ' ');
				const result  = resulta.trim();

				var dummy = document.createElement("textarea");
				// to avoid breaking orgain page when copying more words
				// cant copy when adding below this code
				// dummy.style.display = 'none'
				document.body.appendChild(dummy);
				//Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". â Eduard
				dummy.value = result;
				dummy.select();
				document.execCommand("copy");
				document.body.removeChild(dummy);

				console.log('Substitution result: ', result);
			});

		}

		if (routeHas('/checklist/') || routeHas('/creator_migrate_checklist/') || routeHas('/sequences/') || routeHas('/creator/')) {
			$('.sortable_listing').after('<div class="side_section"><div class="side_section_header">Covers</div><div id="jacCovers"></div></div>');

			// Definir a tabela como flutuante à esquerda
			$('.sortable_listing').css('float', 'left');

			// Definir o elemento side_section_header como flutuante à direita com posicionamento absoluto
			$('.side_section').css({
				'max-width': '620px', 'float': 'right', 'position': 'relative', 'top': '0', // Ajuste conforme necessário
				'right'    : '0' // Ajuste conforme necessário
			});

			// Array para armazenar os números das issues encontradas
			var issueNumbers = [];

			// Selecionar todos os elementos <a> dentro das <td> das <tr>
			setTimeout(function () {
				$('.sortable_listing tr td a').each(function () {
					// Obter o atributo href do elemento <a>
					var hrefValue = $(this).attr('href');
					console.log("hrefValue: ", hrefValue);

					// Verificar se o valor do atributo href contém "issue"
					if (hrefValue && hrefValue.includes("issue")) {
						// Extrair o número da issue utilizando uma expressão regular
						var issueNumber = hrefValue.match(/\d+/)[0];

						// Converter o número para inteiro e adicioná-lo ao array
						issueNumbers.push(parseInt(issueNumber));
					}
				});

				// Exibir os números das issues encontradas (apenas para fins de demonstração)
				console.log("NUMEROS: ", issueNumbers);

			}, 250);

			setTimeout(function () {
				// Loop forEach para percorrer todos os valores em issueNumbers
				issueNumbers.forEach(function (issueNumber) {
					let searchURL   = 'https://www.comics.org/issue/' + issueNumber + '/';
					let coverImgLnk = 'not-found';

					$.get(searchURL, null, function (text) {
						coverImgLnk = $(text).find('.cover_img').attr('src');
						$('#jacCovers').append('<a href="' + searchURL + '" target="_blank"><img style="width: 200px;" src="' + coverImgLnk + '"></a>');
					});
				});
			}, 250);
		}

		if (routeHas('/story/revision/') || routeHas('/issue/revision/')) {
			let mySelection;
			let myTargetElement;

			$('textarea').css("width", "65%");


			$('.select2-container').css('min-width', '57em');
			// removeDuplicados();
			$("input.checkboxinput").click(function () {
				console.log("CLICADO!");
				$(".select2-container--default").css("width", "750px");
			});

			$(document).keydown(function (e) {
				if (e.keyCode == 81 && e.ctrlKey) {

					document.onmouseup = document.onkeyup = document.onselectionchange = function () {
						mySelection = getSelectionText();
					};

					console.log('ctrl Q ' + mySelection);
					myTargetElement = $("#id_appearing_characters").next().find(".select2-search__field").addClass("JAC").css("width", "unset");
					myTargetElement.val(mySelection).focus();
					//  var $elemento = $("select.modelselect2").last();
					//  $(".modelselect2").last().parent().parent().parent().css("background-color", "#cccccc");
					//  myTargetElement = $("select.modelselect2").last().next().find(".select2-search__field");
					//  myTargetElement.val(mySelection).focus();

					//  $("select.modelselect2").last().next().addClass("select2-container--open JACLERIGO").trigger("change");
					//  $("span.modelselect2").last().addClass("JACLERIGO").attr("aria-expanded", true).attr("aria-owns", "select2-id_story_character_revisions-0-character-results").trigger("change");
					//  $("select.modelselect2").trigger("click");

					//  var $elemento = $("select.modelselect2").last();
					//  $elemento.select2('open');
					//  var $search = $elemento.data('select2').dropdown.$search || $elemento.data('select2').selection.$search;
					//  $search.val(mySelection);
					//  $search.trigger('keyup');

					//  setTimeout(function(){
					//      $("a.add-row").click(function(e){
					//      });
					//  }, 250);

				}

			});

			setTimeout(function () {
				console.log("START");

				let $charactersInSeq = [];
				let $roleFeatured    = [];
				let $roleSupporting  = [];
				let $roleAntoganist  = [];
				let $roleVillain     = [];
				let $roleGuest       = [];
				let $roleCameo       = [];
				let $rolenone        = [];

				function buildRoleActions() {
					return "<span class='set_role' data-value='3'>F</span>-<span class='set_role' data-value='5'>S</span>-<span class='set_role' data-value='1'>A</span>-<span class='set_role' data-value='6'>V</span>-<span class='set_role' data-value='4'>G</span>-<span class='set_role' data-value='2'>C</span>-<span class='set_role' data-value='' title='Limpar role'>X</span>";
				}

				function normalizeAnchor(text) {
					return String(text || '').trim().replace(/\s+/g, '-').replace("'", '-').replace(",", '-').replace(".", '-').replace(/"/g, '');
				}

				function listCharacters(item, marginLeft, prefix) {
					let $personagem  = item;
					let $goto_anchor = normalizeAnchor($personagem);
					let $margin      = marginLeft || 0;
					let $prefix      = prefix ? "<span class='jac-tree-prefix'>" + prefix + "</span> " : "";

					$("#mycharacterslist").append("<span style='margin-left:" + $margin + "px'>" + $prefix + buildRoleActions() + " | <span class='characterAnchor' style='cursor:pointer' data-goto-anchor='" + $goto_anchor + "'>" + $personagem + "</span></span><br>");
				}

				function displayCharactersByRole(roleArray, roleTitle, isFirst) {
					let groupMap        = {};
					let ungroupedChars  = [];

					if (!isFirst) {
						$("#mycharacterslist").append("<br>");
					}

					$("#mycharacterslist").append("<span style='font-weight:bold'>" + roleTitle + "</span><br>");

					roleArray.forEach(function (characterID) {
						let $personagem = $charactersInSeq[characterID][1][1];
						let $group      = $charactersInSeq[characterID][7][1];

						if ($group && $group !== '') {
							if (!groupMap[$group]) {
								groupMap[$group] = [];
							}

							groupMap[$group].push($personagem);
						}
						else {
							ungroupedChars.push($personagem);
						}
					});

					Object.keys(groupMap).sort().forEach(function (groupName) {
						let $groupCharacters = groupMap[groupName].sort();

						$("#mycharacterslist").append("<span style='margin-left:20px; font-weight:bold'>" + groupName + ":</span><br>");

						$groupCharacters.forEach(function (personagem, index) {
							let $treePrefix = index === $groupCharacters.length - 1 ? "└" : "├";
							listCharacters(personagem, 40, $treePrefix);
						});
					});

					ungroupedChars.sort().forEach(function (personagem) {
						listCharacters(personagem, 20);
					});
				}

				function getRoleSelectByAnchor(anchorName) {
					let $anchorElement = $('.select2-selection__rendered[myanchor=' + anchorName + ']');

					if (!$anchorElement.length) {
						return $();
					}

					let $elementId = $anchorElement.attr('id');
					if (!$elementId) {
						return $();
					}

					let match       = $elementId.match(/select2-id_story_character_revisions-(\d+)-character-container/);
					let characterID = match ? match[1] : null;

					if (characterID === null) {
						return $();
					}

					return $("#id_story_character_revisions-" + characterID + "-role");
				}

				function setRoleValue($roleSelect, roleValue) {
					if (!$roleSelect.length) {
						return;
					}

					let normalizedValue = typeof roleValue === "undefined" ? "" : String(roleValue);

					if (normalizedValue === "") {
						$roleSelect.prop("selectedIndex", 0);
						$roleSelect.val("");
					}
					else {
						$roleSelect.val(normalizedValue);
					}

					$roleSelect.trigger('change');
				}

				$('.select2-selection__rendered').each(function (e) {
					let $characterRendered = $(this).attr('title');
					let $idCharacter       = $(this).attr('id');

					if (typeof $idCharacter !== 'undefined' && typeof $characterRendered !== 'undefined') {
						if ($idCharacter.indexOf("select2-id_story_character_revisions") !== -1) {

							const regexID = /[0-9]*-([0-9])*\-/gm;
							let $ID       = $idCharacter.match(regexID);
							$ID           = $ID['0'].trim().replace(/(?:-)/g, '');

							console.log("PERSONAGEM", $characterRendered);

							const regexSB   = /\[.*\]/;
							let $personagem = $characterRendered.replace(regexSB, '');
							//console.log("PESONAGEM1", $personagem);

							const regexP = /\(.+?\)/g;
							$personagem  = $personagem.replace(regexP, '');
							// console.log("PESONAGEM2", $personagem);

							let $personagemA = $personagem.split(' - ');
							let $personagemF = $personagemA.slice(-1);
							console.log("PESONAGEMF", $personagemF['0']);

							if (!($ID in $charactersInSeq)) {
								//$("#id_story_character_revisions-"+$ID+"-additional_information").addClass("JACLERIGO");
								let $role;
								let $roleItem;
								if ($("#id_story_character_revisions-" + $ID + "-additional_information").is(':checked')) {
									let $roleID = $("#id_story_character_revisions-" + $ID + "-role").val();
									if ($roleID == 1) {
										$role     = 'Antagonist';
										$roleItem = 2;
										$roleAntoganist.push($ID);
									}
									else if ($roleID == 2) {
										$role     = 'Cameo';
										$roleItem = 4;
										$roleCameo.push($ID);
									}
									else if ($roleID == 3) {
										$role     = 'Featured';
										$roleItem = 0;
										$roleFeatured.push($ID);
									}
									else if ($roleID == 4) {
										$role     = 'Guest';
										$roleItem = 5;
										$roleGuest.push($ID);
									}
									else if ($roleID == 5) {
										$role     = 'Supporting';
										$roleItem = 1;
										$roleSupporting.push($ID);
									}
									else if ($roleID == 6) {
										$role     = 'Villain';
										$roleItem = 3;
										$roleVillain.push($ID);
									}
									else {
										$role     = 'none';
										$roleItem = 6;
										$rolenone.push($ID);
									}
								}
								else {
									$role     = 'none';
									$roleItem = 6;
									$rolenone.push($ID);
								}

								let $flashback = false;
								let $origin    = false;
								let $death     = false;

								if ($("#id_story_character_revisions-" + $ID + "-is_flashback").is(':checked')) {
									$flashback = true;
								}
								if ($("#id_story_character_revisions-" + $ID + "-is_origin").is(':checked')) {
									$origin = true;
								}
								if ($("#id_story_character_revisions-" + $ID + "-is_death").is(':checked')) {
									$death = true;
								}

								let $aName = ['Name', $personagemF['0'].trim()];

								let $aRole  = ['Role', $role];
								let $aFB    = ['Flashback', $flashback];
								let $aOG    = ['Origin', $flashback];
								let $aDT    = ['Death', $flashback];
								let $aNotes = ['Notes', $("#id_story_character_revisions-" + $ID + "-notes").val()];
								let $groupText = $("#id_story_character_revisions-" + $ID + "-group_name option:selected").first().text().trim();
								let $groupName = "";

								if ($groupText !== "") {
									let $groupParts = $groupText.split(" - ");
									$groupName      = ($groupParts.length > 1 ? $groupParts[$groupParts.length - 1] : $groupText).trim();
								}

								let $aGroup = ['Group', $groupName];

								$charactersInSeq[$ID] = ['Personagem', $aName, $aRole, $aFB, $aOG, $aDT, $aNotes, $aGroup];
							}

							$(this).attr("myanchor", normalizeAnchor($personagemF['0'].trim()));
						}
					}
				});
				console.log("ARRAY", $charactersInSeq);

				displayCharactersByRole($roleFeatured, "Featured", true);
				displayCharactersByRole($roleSupporting, "Supporting", false);
				displayCharactersByRole($roleAntoganist, "Antagonist", false);
				displayCharactersByRole($roleVillain, "Villain", false);
				displayCharactersByRole($roleGuest, "Guest", false);
				displayCharactersByRole($roleCameo, "Cameo", false);
				displayCharactersByRole($rolenone, "none", false);

				$(document).off("click.jacCharacterAnchor", ".characterAnchor").on("click.jacCharacterAnchor", ".characterAnchor", function () {
					let $goTo = normalizeAnchor($(this).attr("data-goto-anchor"));
					$('html, body').animate({
						scrollTop: $('.select2-selection__rendered[myanchor=' + $goTo + ']').offset().top - 50
					}, 'slow');
				});

				$(".set_role").css("cursor", "pointer");

				$(document).off("click.jacSetRole", ".set_role").on("click.jacSetRole", ".set_role", function () {
					let $roleValue = $(this).attr("data-value");
					let $goTo      = normalizeAnchor($(this).nextAll(".characterAnchor").attr("data-goto-anchor"));
					console.log("$goTo", $goTo);

					$('html, body').animate({
						scrollTop: $('.select2-selection__rendered[myanchor=' + $goTo + ']').offset().top - 50
					}, 'slow', function () {
						let $roleSelect = getRoleSelectByAnchor($goTo);
						setRoleValue($roleSelect, $roleValue);
					});
				});


				$("#id_characters")
					.after('<button type="button" id="btn_translate_characters" style="padding: 6px; position: relative; top: -140px; right: -10px; cursor: pointer"' + ' title="Traduzir">' + '<i class="fa-duotone fa-language"></i></button></div>');

				$("#btn_translate_characters").click(function () {
					var $notes = $("#id_characters").val();
					$notes     = $notes.replace(/First Appearance/gmi, "primeira aparição");
					$notes     = $notes.replace(/Appears on screen/gmi, "aparece num ecrã");
					$notes     = $notes.replace(/Only in flashback/gmi, "apenas em flashback");
					$notes     = $notes.replace(/Death|dies/gmi, "morre");
					$notes     = $notes.replace(/Sergeant /gmi, "Sargento ");
					$notes     = $notes.replace(/Carving/gmi, "estátua");
					$notes     = $notes.replace(/Behind the scenes/gmi, "fora de cena");
					$("#id_characters").val($notes);

				})

				addBtnNotes();

			}, 500);

			// Detecta a mudança na seleção do dropdown
			$('#id_type').change(function () {
				// Verifica se a opção selecionada é "blank page(s)"
				if ($(this).val() === "24") {
					// Define o valor do elemento com id "id_page_count" para 1
					$('#id_page_count').val("1");

					// Seleciona as checkboxes com os IDs fornecidos
					$('#id_no_script, #id_no_pencils, #id_no_inks, #id_no_colors, #id_no_letters').prop('checked', true);
				}
			});
		}

		// $("input[name*='discard']").replaceWith('<button type="submit" name="discard" value="Discard"><i class="fa-duotone fa-recycle" style="color: green;"></i>
		// Discard</button>');
		// $("input[name*='retract']").replaceWith('<button type="submit" name="retract" value="Retract and edit further"><i class="fa-duotone fa-undo" style="color:
		// red;"></i> Retract and edit further</button>');


		if (routeIs('/queues/editing/')) {
			fixQueueDiscardButtons();
		}
		else {
			replaceInput2Button("Discard", "fa-duotone fa-light fa-trash");
		}
		replaceInput2Button("Retract And Edit Further", "fa-duotone fa-light fa fa-rotate-left");
		replaceInput2Button("Edit", "fa-duotone fa-i-cursor");
		replaceInput2Button("Edit Issue Fields", "fa-duotone fa-i-cursor");
		replaceInput2Button("Compare & Copy", "fa-duotone fa-light fa fa-code-compare");
		replaceInput2Button("Remove New Sequence", "fa-duotone fa-light fa-trash");
		replaceInput2Button("Edit issue fields", "fa-duotone fa-i-cursor");
		replaceInput2Button("Copy story", "fa-duotone fa-light fa fa-copy");
		replaceInput2Button("Reorder issue stories", "fa-duotone fa-sort-amount-up-alt");
		replaceInput2Button("Edit issue/story reprint links", "fa-duotone fa-edit");
		replaceInput2Button("Add Reprint", "fa-duotone fa-light fa fa-clone");
		replaceInput2Button("Add variant issue", "fa-duotone fa-hand-scissors");
		replaceInput2Button("Move to series with id", "fa-duotone fa-light fa fa-suitcase-rolling");
		replaceInput2Button("Copy sequence", "fa-duotone fa-light fa fa-copy");
		replaceInput2Button("Migrate Credits", "fa-duotone fa-light fa fa-reflect-vertical");
		replaceInput2Button("Migrate Editing", "fa-duotone fa-light fa fa-reflect-vertical");
		normalizeDiscardRetractLayout();

		$("input[value='Mark to Delete']").replaceWith('<button type="submit" value="Mark to Delete" class="btn_delete"><i class="fa-duotone fa-times-circle"></i> Mark to Delete</button>');

		if (routeHas("changeset")) {
			replaceInputPrefix2Button("Add ", "fa-duotone fa-light fa fa-clone", ["Add Variant Issue", "Add variant issue", "Add Reprint", "Add reprint"]);
			replaceInput2Button("Add Variant Issue", "fa-duotone fa-hand-scissors");

			var series    = $(".body_content > h1 > a").attr("href");
			var publisher = $(".body_content > h1 > a").next().attr("href");
			var issue     = $("h1 > a").next().next().attr("href");
			console.log("series", series, "publisher", publisher, "issue", issue);

			// Create the floating container HTML
			const floatingBoxHtml = `
        <div id='img_cover_placeholder' style='
            position: fixed; /* Keeps it fixed relative to the viewport */
            right: 20px; /* Position 20px from the right edge */
            top: 50%; /* Position the top edge at the vertical center */
            transform: translateY(-50%); /* Shift upwards by half its height to truly center */
            width: 400px; /* Adjust width as needed, e.g., 200px image + padding */
            background-color: #fff; /* Optional: background for visibility */
            border: 1px solid #ccc; /* Optional: border for visibility */
            padding: 10px; /* Optional: internal spacing */
            box-shadow: 3px 3px 10px rgba(0,0,0,0.2); /* Optional: visual effect */
            z-index: 1000; /* Ensure it stays on top of other content */
        '>
            <div class='img_placeholder' style='text-align: center;'></div>
            <!-- Placeholder for the image -->
        </div>`;

			// Append the floating box to the body
			$("body").append(floatingBoxHtml);

			// --- The $.get call remains largely the same, but targets the new structure ---
			$.get(origin + issue + 'cover/4/', function (result) {
				let obj         = $(result).find('.cover_img');
				let link_imagem = obj.attr("src"); // Keep w200 for a 220px wide container
				// If you need a larger image despite the container size, you might use:
				// let link_imagem_grande = link_imagem.replace("w200", "w400");
				console.log("imagem", obj.attr("src"));

				// Append the image to the placeholder inside the floating div
				// Added style to ensure image fits the container width
				$("#img_cover_placeholder .img_placeholder").append(
					"<div id='image_preview'><img id='coverImage' src='" + link_imagem + "' style='display: block; max-width: 100%; height: auto; margin: 0 auto;'></div>"
				);

				// Storing the w200 image URL in the cookie
				Cookies.set('imgCookie', link_imagem, {
					path: '/', expires: 365
				});
			});
		}

		showFloatingSaveBar();


		addGlobalStyle('.w-24 {width: auto; padding-right: 6px; padding-left: 6px; font-weight: bold;} .py-1 {padding: 0;} .border-y, table.border {border-width: 0;}');
		addGlobalStyle('.btn_edit, .btn_reprint { text-align: left;}');
		addGlobalStyle('.btn_migrate { text-align: left; background-color: darkgreen; color: white; width: 125px;}');
		addGlobalStyle('.btn_delete { text-align: left; background-color: red; color: white; width: 125px;}');
		addGlobalStyle('table.border tr:nth-child(even) { background-color: #f2f2f2; }');
		addGlobalStyle('.jac-discard-retract-pair { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; } .jac-discard-retract-pair .btn-queue-action { display: inline-flex !important; width: auto !important; align-items: center; justify-content: center; } .jac-discard-retract-pair button { display: inline-flex; align-items: center; gap: 4px; }');
		addGlobalStyle('.jac-markdown-field { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; width: 100%; } .jac-markdown-toolbar { display: flex; flex-wrap: wrap; gap: 4px; margin: 0 0 4px 0; } .jac-markdown-toolbar .btn-blue-editing { display: inline-flex; align-items: center; justify-content: center; margin: 0; } .jac-markdown-toolbar button { cursor: pointer; } .jac-markdown-toolbar i { pointer-events: none; }');

		initializeMarkdownToolbar();

		function initializeMarkdownToolbar() {
			let $targets = getMarkdownToolbarTargets();

			if (!$targets.length) {
				return;
			}

			$targets.each(function () {
				let $textarea   = $(this);
				let targetName  = $textarea.attr("name") || $textarea.attr("id") || "markdown";
				let $wrapper    = getMarkdownFieldWrapper($textarea);
				let $hasToolbar = $wrapper.children(".jac-markdown-toolbar[data-target-name='" + targetName + "']");

				if (!$hasToolbar.length) {
					$wrapper.prepend(createMarkdownToolbar().attr("data-target-name", targetName));
				}
			});

			$(document).off("click.jacMarkdownBold", ".jac-markdown-bold").on("click.jacMarkdownBold", ".jac-markdown-bold", function (e) {
				e.preventDefault();
				applyMarkdownWrap(getMarkdownTextareaFromToolbarButton($(this)), "**", "**");
			});

			$(document).off("click.jacMarkdownItalic", ".jac-markdown-italic").on("click.jacMarkdownItalic", ".jac-markdown-italic", function (e) {
				e.preventDefault();
				applyMarkdownWrap(getMarkdownTextareaFromToolbarButton($(this)), "*", "*");
			});

			$(document).off("click.jacMarkdownSearch", ".jac-markdown-search").on("click.jacMarkdownSearch", ".jac-markdown-search", function (e) {
				e.preventDefault();
				let $textarea = getMarkdownTextareaFromToolbarButton($(this));
				let selected  = getTextareaSelection($textarea).trim();

				if (selected === "") {
					return;
				}

				window.open(origin + "/searchNew/?q=" + encodeURIComponent(selected), "_blank");
			});

			$(document).off("click.jacMarkdownPasteLink", ".jac-markdown-paste-link").on("click.jacMarkdownPasteLink", ".jac-markdown-paste-link", async function (e) {
				e.preventDefault();

				let $textarea    = getMarkdownTextareaFromToolbarButton($(this));
				let selectedText = getTextareaSelection($textarea);

				if (selectedText.trim() === "") {
					return;
				}

				if (!navigator.clipboard || typeof navigator.clipboard.readText !== "function") {
					alert("Clipboard API indisponível neste contexto.");
					return;
				}

				try {
					let clipboardText = await navigator.clipboard.readText();
					let referenceData = parseMarkdownReference(clipboardText);

					if (!referenceData) {
						alert("Clipboard não contém referência válida.");
						return;
					}

					insertMarkdownReference($textarea, selectedText, referenceData);
				}
				catch (error) {
					console.error("Erro ao ler clipboard para markdown:", error);
					alert("Erro ao ler clipboard.");
				}
			});
		}

		function getMarkdownToolbarTargets() {
			let selectors = [];

			if (routeMatch(/^\/changeset\/\d+\/edit\/$/)) {
				selectors.push("textarea[name='description']", "textarea[name='notes']");
			}

			if (routeIs('/character/add/')) {
				selectors.push("textarea[name='description']");
			}

			if (!selectors.length) {
				return $();
			}

			return $(selectors.join(", ")).filter(function () {
				return $(this).length && !$(this).prop("disabled");
			});
		}

		function getMarkdownFieldWrapper($textarea) {
			let $field = $textarea.closest(".markdownx");

			if (!$field.length) {
				$field = $textarea;
			}

			if (!$field.parent().hasClass("jac-markdown-field")) {
				$field.wrap("<div class='jac-markdown-field'></div>");
			}

			return $field.parent();
		}

		function createMarkdownToolbar() {
			return $(
				"<div class='jac-markdown-toolbar'>" +
				"<button type='button' class='btn-blue-editing jac-markdown-bold' title='Bold' aria-label='Bold'><i class='fa-duotone fa-bold'></i></button>" +
				"<button type='button' class='btn-blue-editing jac-markdown-italic' title='Italic' aria-label='Italic'><i class='fa-duotone fa-italic'></i></button>" +
				"<button type='button' class='btn-blue-editing jac-markdown-search' title='Search' aria-label='Search'><i class='fa-duotone fa-search'></i></button>" +
				"<button type='button' class='btn-blue-editing jac-markdown-paste-link' title='Paste Link' aria-label='Paste Link'><i class='fa-duotone fa-link'></i></button>" +
				"</div>"
			);
		}

		function getMarkdownTextareaFromToolbarButton($button) {
			return $button.closest(".jac-markdown-field").find("textarea").first();
		}

		function getTextareaSelection($textarea) {
			let textarea = $textarea.get(0);

			if (!textarea) {
				return "";
			}

			return (textarea.value || "").substring(textarea.selectionStart || 0, textarea.selectionEnd || 0);
		}

		function applyMarkdownWrap($textarea, prefix, suffix) {
			let textarea = $textarea.get(0);

			if (!textarea) {
				return;
			}

			let value     = $textarea.val() || "";
			let start     = textarea.selectionStart || 0;
			let end       = textarea.selectionEnd || 0;
			let selected  = value.substring(start, end);
			let inserted  = prefix + selected + suffix;
			let newValue  = value.substring(0, start) + inserted + value.substring(end);
			let rangeFrom = start + prefix.length;
			let rangeTo   = rangeFrom + selected.length;

			$textarea.val(newValue).trigger("input").trigger("change");
			textarea.focus();

			if (selected === "") {
				textarea.setSelectionRange(rangeFrom, rangeFrom);
			}
			else {
				textarea.setSelectionRange(rangeFrom, rangeTo);
			}
		}

		function parseMarkdownReference(text) {
			let clipboardText = String(text || "").trim();

			if (clipboardText === "") {
				return null;
			}

			let definitionMatch = clipboardText.match(/^\[(\d+)]:\s*(\S+)$/m);

			if (!definitionMatch) {
				return null;
			}

			let referenceId  = definitionMatch[1];
			let referenceUrl = definitionMatch[2];
			let referenceDef = "[" + referenceId + "]: " + referenceUrl;

			return {
				id  : referenceId,
				url : referenceUrl,
				line: referenceDef
			};
		}

		function insertMarkdownReference($textarea, selectedText, referenceData) {
			let textarea = $textarea.get(0);

			if (!textarea) {
				return;
			}

			let value        = $textarea.val() || "";
			let start        = textarea.selectionStart || 0;
			let end          = textarea.selectionEnd || 0;
			let cleanSelection = selectedText.trim();
			let replacement  = "[" + cleanSelection + "][" + referenceData.id + "]";
			let updatedValue = value.substring(0, start) + replacement + value.substring(end);

			if (updatedValue.indexOf(referenceData.line) === -1) {
				updatedValue = updatedValue.replace(/\s*$/, "");
				updatedValue += (updatedValue === "" ? "" : "\n\n") + referenceData.line;
			}

			$textarea.val(updatedValue).trigger("input").trigger("change");
			textarea.focus();
			textarea.setSelectionRange(start + replacement.length, start + replacement.length);
		}

		function replaceInput2Button(value, fontawesome) {
			let element = $("input[value='" + value + "']");

			if (element.length === 0) {
				// Se o input não for encontrado, tenta encontrar um button com o mesmo valor
				element = $("button").filter(function () { return $(this).text() === value; });
				if (element.length > 0) {
					console.log("BOTAO: ", value);
					// Se for um button, adiciona o ícone antes do texto
					element.prepend('<i class="' + fontawesome + '"></i> ');
				}
			}
			else {
				console.log("INPUT: ", value);
				// Se for um input, adiciona o ícone antes do input
				element.before('<i class="' + fontawesome + '"></i> ');
				// Se o elemento pai do input for um button, adicionar o estilo
				if (element.parent().is('button')) {
					element.parent().css({'display': 'flex', 'align-items': 'center'});
				}
			}
		}

		function replaceInputPrefix2Button(prefix, fontawesome, excludes) {
			const excludedValues = (excludes || []).map(function (item) {
				return String(item).toLowerCase();
			});

			$("input[type='submit']").filter(function () {
				const value = ($(this).val() || "").trim();
				if (value.indexOf(prefix) !== 0) {
					return false;
				}
				return excludedValues.indexOf(value.toLowerCase()) === -1;
			}).each(function () {
				const $input  = $(this);
				const $parent = $input.parent();

				if ($input.attr("data-jac-iconized") === "1" || $parent.attr("data-jac-iconized") === "1") {
					return;
				}

				if ($parent.is("button")) {
					$parent.prepend('<i class="' + fontawesome + '"></i> ');
					$parent.css({'display': 'flex', 'align-items': 'center'});
					$parent.attr("data-jac-iconized", "1");
				}
				else {
					$input.before('<i class="' + fontawesome + '"></i> ');
					$input.attr("data-jac-iconized", "1");
				}
			});

			$("button").filter(function () {
				const $button = $(this);
				const text    = $button.clone().children().remove().end().text().trim();

				if (text.indexOf(prefix) !== 0) {
					return false;
				}

				if (excludedValues.indexOf(text.toLowerCase()) !== -1) {
					return false;
				}

				return !$button.find("input[type='submit']").length;
			}).each(function () {
				const $button = $(this);
				if ($button.attr("data-jac-iconized") === "1") {
					return;
				}

				$button.prepend('<i class="' + fontawesome + '"></i> ');
				$button.attr("data-jac-iconized", "1");
			});
		}

		function fixQueueDiscardButtons() {
			$("input[type='submit'][value='Discard']").each(function () {
				const $input = $(this);

				if ($input.attr("data-jac-iconized") === "1") {
					return;
				}

				$input.prev("i").remove();

				const buttonText  = ($input.val() || "Discard").trim();
				const $parent     = $input.parent();
				const replaceNode = $parent.is("button") ? $parent : $input;
				const $button     = $("<button type='submit'></button>");
				const attrsToCopy = ["name", "id", "class", "title", "formaction", "formmethod", "formenctype", "formtarget", "formnovalidate"];

				attrsToCopy.forEach(function (attr) {
					const attrValue = $input.attr(attr);
					if (typeof attrValue !== "undefined") {
						$button.attr(attr, attrValue);
					}
				});

				if ($input.is(":disabled")) {
					$button.prop("disabled", true);
				}

				if ($parent.is("button")) {
					const parentClass = ($parent.attr("class") || "").trim();
					if (parentClass !== "") {
						$button.addClass(parentClass);
					}
				}

				$button.attr("value", buttonText);
				$button.attr("data-jac-iconized", "1");
				$button.css({'display': 'inline-flex', 'align-items': 'center', 'gap': '4px'});
				$button.html('<i class="fa-duotone fa-light fa-trash"></i> ' + buttonText);

				replaceNode.replaceWith($button);
			});
		}

		function normalizeDiscardRetractLayout() {
			$("form").each(function () {
				const $form      = $(this);
				const $discardEl = $form.find("button[name='discard'], input[type='submit'][name='discard'], input[type='submit'][value='Discard']").first();
				const $retractEl = $form.find("button[name='retract'], input[type='submit'][name='retract'], button:contains('Retract And Edit Further'), input[type='submit'][value='Retract And Edit Further']").first();

				if (!$discardEl.length || !$retractEl.length) {
					return;
				}

				if ($discardEl.closest('.jac-discard-retract-pair').length || $retractEl.closest('.jac-discard-retract-pair').length) {
					return;
				}

				const $discardUnit = getActionUnit($discardEl);
				const $retractUnit = getActionUnit($retractEl);
				const $pair        = $("<div class='jac-discard-retract-pair'></div>");

				$discardUnit.first().before($pair);
				$pair.append($discardUnit);
				$pair.append($retractUnit);
			});

			function getActionUnit($actionElement) {
				let $target = $actionElement;

				if ($target.is("input") && $target.parent().is("button")) {
					$target = $target.parent();
				}

				if ($target.prev("i").length) {
					return $target.prev("i").addBack();
				}

				return $target;
			}
		}

		function addGlobalStyle(css) {
			var head, style;
			head = document.getElementsByTagName('head')[0];
			if (!head) {
				return;
			}
			style           = document.createElement('style');
			style.type      = 'text/css';
			style.innerHTML = css;
			head.appendChild(style);
		}

		function sortNameAdjust(elementName, elementSortName) {
			$("#" + elementSortName).focusin(function () {
				var $nome         = $("#" + elementName).val().trim();
				var $nomeArray    = $nome.split(" ");
				var $tamanhoArray = $nomeArray.length;

				if ($tamanhoArray > 1) {
					var $primeiros = "";
					var $ultimos   = $nomeArray[$tamanhoArray - 1] + ', ';

					$nomeArray.pop();
					$nomeArray.forEach(junta);

					function junta(item, index) {
						$primeiros = $primeiros + item + " ";
					}

					var $completo = $ultimos + $primeiros;

					$(this).val($completo.trim());

				}
				else {
					$(this).val($nome);
				}
			});
		}

		function showFloatingSaveBar() {
			console.log("showFloatingSaveBar Loaded");
			if (routeHas('/story/revision/') || routeHas('/issue/revision/')) {

				// --- Create Save Bar ---
				if ($("#savebar").length === 0) {
					const $targetForm = $("form").last();
					if ($targetForm.length > 0) {
						console.log("Savebar: Target form (last form) found. Creating #savebar.");
						$("<div id='savebar' style='width: 100%; background-color: rgba(0, 0, 0, 0.85); position: fixed; bottom: 0px; left: 0px; padding: 10px 20px; text-align: center; z-index: 1001; box-shadow: 0px -2px 5px rgba(0,0,0,0.5);'></div>")
							.appendTo($targetForm); // Anexar ao formulário encontrado
					}
					else {
						console.error("Savebar: Target form (last form) not found. #savebar NOT created.");
						return; // Não continuar se não puder criar a savebar
					}
				}

				const $savebar = $("#savebar"); // Cache o seletor APÓS a criação

				if ($savebar.length === 0) {
					console.error("Savebar: #savebar div was NOT found in DOM after attempting to create it. Buttons will not be moved.");
					return; // Não continuar se a savebar não existe
				}
				else {
					console.log("Savebar: #savebar div IS present in DOM. Length:", $savebar.length);
				}

				// --- Move and Wrap Buttons ---

				// Helper function to move and wrap an input/element
				function moveAndWrapInput(inputElementOrSelector, buttonClass, applyInlineStyles = true, addFormNoValidate = false) {
					const $input = (typeof inputElementOrSelector === 'string') ? $(inputElementOrSelector) : inputElementOrSelector;

					console.log(`moveAndWrapInput: Processing input:`, (typeof inputElementOrSelector === 'string' ? inputElementOrSelector : $input.attr('name')), `Found: ${$input.length > 0}`);

					if ($input.length) {
						// Verificar se o input já está dentro da savebar (para evitar processamento duplo)
						if ($input.closest("#savebar").length > 0) {
							console.warn("moveAndWrapInput: Input", $input.val(), "já está na savebar. Ignorando.");
							return;
						}

						const $button = $(`<button class="${buttonClass}"></button>`);
						if (applyInlineStyles) {
							$input.css({'text-transform': 'uppercase', 'padding': '8px'});
						}
						if (addFormNoValidate) {
							$input.attr('formnovalidate', 'formnovalidate'); // O valor pode ser o próprio nome do atributo
						}

						// Guardar o HTML do input original para log, caso desapareça
						const originalInputHTML = $input[0] ? $input[0].outerHTML : "Input não encontrado antes de mover";

						// Move input into the button
						$button.append($input);

						console.log(`moveAndWrapInput: Tentando anexar botão (contendo ${$input.val()}) à $savebar. $savebar[0]:`, $savebar[0] ? $savebar[0].outerHTML.substring(0, 150) : "N/A");
						// Then button into the savebar
						$button.appendTo($savebar);

						// Verificar se a anexação foi bem-sucedida
						if ($savebar.find($button).length) {
							console.log(`moveAndWrapInput: SUCESSO - Botão para "${$input.val()}" anexado à savebar.`);
						}
						else {
							console.error(`moveAndWrapInput: FALHA - Botão para "${$input.val()}" NÃO FOI ANEXADO à savebar. Input original: ${originalInputHTML}. Savebar HTML atual: ${$savebar.html()}`);
						}

						$button.css('margin', '0 5px');
					}
					else {
						console.warn("moveAndWrapInput: Input não encontrado para:", inputElementOrSelector);
					}
				}

				// Handle 'save_return' button ("Save And Return To Changeset")
				moveAndWrapInput("button[name='save_return']", "", true, false);

				// Handle 'save' button ("Save And Continue Editing")
				moveAndWrapInput("button[name='save']", "", true, false);

				// Handle 'add' button ("Save Story")
				moveAndWrapInput("button[name='add']", "btn-blue-editing inline", false, false);

				// Handle 'cancel_return' buttons individually
				$("button[name='cancel_return']").each(function () {
					const $currentCancelInput = $(this); // Usar o elemento jQuery da iteração atual
					const value               = $currentCancelInput.val().toLowerCase();

					// Determinar classe e estilos com base no valor do botão
					const buttonClass = value.includes('cancel') ? "btn-blue-editing inline" : "";
					// Não aplicar estilos uppercase/padding se for o "Cancel" simples (que já tem btn-blue-editing)
					const applyStyles = !value.includes('cancel');

					// Chamar moveAndWrapInput com o elemento jQuery atual
					// Todos os botões de cancelamento devem ter formnovalidate
					moveAndWrapInput($currentCancelInput, buttonClass, applyStyles, true);
				});

				// --- Floating Links and Character List Setup ---
				// Check if the master container already exists to avoid duplication
				if ($("#master").length === 0) {
					const divStyle        = "max-height: 80vh; overflow-y: auto; min-width: 150px; min-height: 50px; background-color: rgb(221 255 0 / 95%); position: fixed; top: 14px; right: 200px; padding: 20px; z-index: 1000; border: 1px solid #ccc; box-shadow: 2px 2px 5px rgba(0,0,0,0.2);";
					const floatLinksStyle = "width: 180px; min-height: 50px; background-color: rgba(0, 0, 0, 0.75); position: fixed; top: 14px; right: 14px; padding: 15px; z-index: 1000; border-radius: 5px; box-shadow: 2px 2px 5px rgba(0,0,0,0.2);";

					// Append the structure for characters list and floating links to the first div.edit element
					$("div.edit").first().append(
						"<div id='master'>" +
						"<div id='mycharacterslist' style='" + divStyle + "'></div>" +
						"<div id='floatLinks' style='" + floatLinksStyle + "'></div>" +
						"</div>"
					);
				}
				const $floatLinksDiv = $("div#floatLinks"); // Cache selector

				// --- Image Cookie Handling ---
				let $img_cookie = Cookies.get('imgCookie');
				if ($img_cookie && $img_cookie !== 'null' && $img_cookie !== 'undefined') {
					console.log("Image cookie found: ", $img_cookie);
					$floatLinksDiv.find('img').remove(); // Remove existing image first
					// Prepend image with styling
					$floatLinksDiv.prepend("<img src='" + $img_cookie + "' style='max-width: 100%; height: auto; display: block; margin-bottom: 15px; border-radius: 3px;'><br>");
				}
				else {
					console.log("Image cookie not found or invalid!");
					$floatLinksDiv.find('img').remove(); // Ensure no broken image is shown
				}

				// --- Floating Links Buttons ---
				// Add buttons only if they don't exist inside floatLinksDiv
				if ($floatLinksDiv.find("button#main").length === 0) {
					const buttonStyle = "style='width: 100%; background-color: lightgray; margin-bottom: 8px; padding: 5px; border: 1px solid #555; border-radius: 3px; cursor: pointer;'";
					$floatLinksDiv.append(`<button type='button' id='main' ${buttonStyle}>Main</button><br>`);
					$floatLinksDiv.append(`<button type='button' id='ccredits' ${buttonStyle}>Creator Credits</button><br>`);
					$floatLinksDiv.append(`<button type='button' id='charactersTop' ${buttonStyle}>Characters Top</button><br>`);
					$floatLinksDiv.append(`<button type='button' id='characters' ${buttonStyle.replace('margin-bottom: 8px;', '')}>Characters Bottom</button>`); // No margin on last button
				}

				// --- Attach click handlers using .off().on() to prevent duplicates ---
				$floatLinksDiv.off('click', 'button').on('click', 'button', function () {
					let targetSelector = '';
					let offset         = 0;
					switch (this.id) {
						case 'main':
							targetSelector = "#sizing_base"; // Main content area identifier
							offset         = 0;
							break;
						case 'ccredits':
							targetSelector = "#id_no_script"; // An element within the credits section
							offset         = -100;
							break;
						case 'charactersTop':
							targetSelector = "#id_appearing_characters"; // Top of the characters section
							offset         = -175;
							break;
						case 'characters':
							targetSelector = "#id_characters"; // Bottom character notes field
							offset         = -175;
							break;
					}

					const $target = $(targetSelector);
					if ($target.length) {
						$('html, body').animate({scrollTop: $target.offset().top + offset}, 500);
					}
					else {
						console.warn(`Target element "${targetSelector}" not found for button #${this.id}`);
					}
				});

			} // End of route check for revision pages
		}

		function copy(selector) {
			var $temp = $("<div>");
			$("body").append($temp);
			$temp.attr("contenteditable", true)
				.html($(selector).html()).select()
				.on("focus", function () {
					document.execCommand('selectAll', false, null);
				})
				.focus();
			document.execCommand("copy");
			$temp.remove();
		}

		function getSelectionText() {
			var text            = "";
			var activeEl        = document.activeElement;
			var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
			if ((activeElTagName == "textarea") || (activeElTagName == "input" && /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) && (typeof activeEl.selectionStart == "number")) {
				text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
			}
			else if (window.getSelection) {
				text = window.getSelection().toString();
			}
			return text;
		}

		function addBtnNotes() {
			var elementoNotas = $('#id_notes');
			var btnClass      = "class='btn-blue-editing inline-block'";
			var btnStyle      = "style='position: relative; top: -140px; right: -10px; cursor: pointer'";
			elementoNotas
				.after(`<button ${btnClass} type='button' id='btnAddText3' ${btnStyle} title='Sinopses'> <i class='fa-duotone fa-3'></i></button>`)
				.after(`<button ${btnClass} type='button' id='btnAddText2' ${btnStyle} title='Publicidade Genérica'> <i class='fa-duotone fa-2'></i></button>`)
				.after(`<button ${btnClass} type='button' id='btnAddText1' ${btnStyle} title='Publicidade a Revista'> <i class='fa-duotone fa-1'></i></button>`);

			$("#btnAddText1").click(function (e) {
				e.preventDefault();
				let t1          = $("#id_title").val();
				let t2          = $("#id_feature").val();
				let t3          = elementoNotas.val();
				let quebralinha = "";

				if (t3 !== '') {
					quebralinha = "\n";
				}
				let notes = t3 + quebralinha + "Publicidade à revista: " + t2 + " - " + t1 + ".";
				elementoNotas.val(notes);
			});

			$("#btnAddText2").click(function (e) {
				e.preventDefault();
				let t3          = elementoNotas.val();
				let quebralinha = "";

				if (t3 !== '') {
					quebralinha = "\n";
				}
				let notes = t3 + quebralinha + "Publicidade: ";
				elementoNotas.val(notes);
			});

			$("#btnAddText3").click(function (e) {
				e.preventDefault();
				let t3          = elementoNotas.val();
				let quebralinha = "";

				if (t3 !== '') {
					quebralinha = "\n";
				}
				let notes = t3 + quebralinha + "Página com breves sinopses sobre: ";
				elementoNotas.val(notes);
			});
		}

	});
})(jQuery, Cookies);