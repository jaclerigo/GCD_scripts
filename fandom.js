var $ = window.jQuery;
$.noConflict();

(function () {
	'use strict';

	alert("teste2");

	$(".top-ads-container, .global-navigation, .page__right-rail, .bottom-ads-container, .mcf-wrapper").remove();

	let $pesquisa = $("#firstHeading").html();
	let regex     = / *\([^)]*\) */g;
	$pesquisa     = $pesquisa.replace(regex, '');
	regex         = /(?:vol \d )/gi;
	$pesquisa     = $pesquisa.replace(regex, '');

	// teste //
	const searchLinks = [{
		text: 'I-GCD',
		url : `https://www.comics.org/searchNew/?q=${$pesquisa}&selected_facets=facet_model_name_exact:issue&sort=chrono`
	},
		{
			text: 'C-GCD',
			url : `https://www.comics.org/searchNew/?q=${$pesquisa}&selected_facets=facet_model_name_exact:character&language=pt`
		},
		{
			text: 'GDQ',
			url : `http://www.guiadosquadrinhos.com/personagens/${$pesquisa}`
		}];

	const searchLinksHTML = searchLinks
		.map(link => `<a href="${link.url}" target="_blank">${link.text}</a>`)
		.join(' - ');

	const div    = `<div style='width: 100%; text-align: center'>${searchLinksHTML}</div>`;
	const button = `<button type='button' id='copy'>Copy Data</button>`;

	$("#firstHeading").after(`${div} ${button}`);

	$("#copy").click(function () {
		var text     = $('#firstHeading').text();
		var universo = '';

		// universo
		const matches = text.match(/\(([^)]+)\)/g);
		$.each(matches, function (index, value) {
			if (value.includes('Earth-')) {
				universo = value;
			}
		});

		universo = universo.replace(/[()]/g, '');

		var personagem = text.replace(/\([^)]+\)/g, '').trim();
		var issueInfo;
		var publication_date;

		const outputpersonagem = personagem
			.replace(/\r?\n/g, ' ') // Replace newlines with a single space
			.replace(/\t/g, '') // Remove tabs
			.replace(/  +/g, ' '); // Replace multiple spaces with a single space

		Promise.all([getGCDIssueFirst(), getGCDIssueDeath(), getGCDCreators()])
			.then(([issueInfoFirst, issueInfoDeath, Creators]) => {

				console.log("PROMISE First", issueInfoFirst, "\nPROMISE Death: ", issueInfoDeath, "\nPROMISE Creators ", Creators);

				var hero;
				hero = $('h2[data-source="Title"]').text();
				console.log("Hero: ", hero);

				let firstCreatedEl = $('div[data-source="First"]');

				let firstCreated = firstCreatedEl.find('a').map(function () {
					return $(this).text();
				}).get().join(', ');

				let stringCompleta = issueInfoFirst;
				console.log("\nstringCompleta: ", stringCompleta, "\n");

				// obtenção do ano da publicação
				let input       = stringCompleta;
				const pattern1  = /\(([^)]+)\)/g;
				const matches   = input.match(pattern1);
				const lastMatch = matches[matches.length - 1];
				console.log(lastMatch);
				const pattern2 = /\d{4}/g;
				const year     = lastMatch.match(pattern2)[0];
				console.log("ANO: ", year);


				var array                  = [];
				array['personagem']        = outputpersonagem;
				array['universo']          = universo;
				array['heroi']             = hero;
				array['criadores']         = Creators;
				array['ano']               = year;
				array['primeira_aparicao'] = issueInfoFirst;
				if (issueInfoDeath != 'NOTOK') {
					array['morte'] = issueInfoDeath;
				}

				console.log("ARRAY: ", array);

				const newArray   = Object.entries(array).map(([key, value]) => ({[key]: value}));
				const jsonString = JSON.stringify(newArray);
				console.log("JSON: ", jsonString);

				// Convert the array to a string
				let copyString = JSON.stringify(jsonString);

				// Create a textarea element and append it to the body
				let textarea = $('<textarea></textarea>');
				textarea.val(copyString);
				$('body').append(textarea);

				// Select the text in the textarea
				textarea.select();

				// Execute the copy command
				document.execCommand('copy');

				// Remove the textarea element
				textarea.remove();

				console.log("Dados Copiados", array);

			});

	});

	let $categorias = $(".page-header__categories").find("a").attr("title");
	if ($categorias.indexOf("Characters") !== -1) {
		let $pesquisa = $("h2[data-source*='Title']").find("a").attr("title");
		$("h2[data-source*='Title']")
			.after("<div style='width: 100%; text-align: center'><a href='https://www.comics.org/searchNew/?q=" + $pesquisa + "&selected_facets=facet_model_name_exact:character' target='_blank'>GCD</a>" +
				" - <a href='http://www.guiadosquadrinhos.com/personagens/" + $pesquisa + "' target='_blank'>GDQ</a></div>");

	}

	regex     = /(?:vol \d )/gi;
	$pesquisa = $("div[data-source*='First']").find("a").attr("title");
	$pesquisa = $pesquisa.replace(regex, '');
	// console.log("PESQUISA", $pesquisa);
	// alert("PESQUISA: " + $pesquisa);
	$("div[data-source*='First']").append("<br><a href='https://www.comics.org/searchNew/?q=" + $pesquisa + "&selected_facets=facet_model_name_exact:issue&sort=chrono' target='_blank'>GCD</a>");

	$pesquisa = '';
	$pesquisa = $("div[data-source='Death']").find("a").addClass("JACLERIGO").attr("title");
	if ($pesquisa !== '') {
		$pesquisa = $pesquisa.replace(regex, '');
		// console.log("PESQUISA", $pesquisa);
		$("div[data-source*='Death']").append("<br><a href='https://www.comics.org/searchNew/?q=" + $pesquisa + "&selected_facets=facet_model_name_exact:issue&sort=chrono' target='_blank'>GCD</a>");
	}


	function getGCDCreators() {
		const deferred = $.Deferred();

		let creatorsDiv = $('div[data-source="Creators"]');
		let creators    = creatorsDiv.find('a').map(function () {
			return $(this).text();
		}).get().join(', ');

		// Substitua a última vírgula por "and"
		creators = creators.replace(/,(?=[^,]*$)/, ' and');

		// Adicione um ponto ao final da string
		creators = creators.concat('.');

		console.log("CREATORS String: ", creators); // "Roy Thomas, Don Heck, Werner Roth."

		$.ajax({
			url     : "https://concept.clerigo.pt/proxy.php",
			dataType: "JSON",
			type    : "GET",
			data    : {
				searchType: 'creators',
				creators  : creators
			},
			success : function (data) {
			},
			error   : function (jqXHR, textStatus, errorThrown) {
				console.error("CRIADORES: An error occurred: " + errorThrown);
			}
		})
			.done(function (data) {
				console.log('RESULTADO CRIADORES:', data.creators);
				const creatorsInfo = data.creators;
				deferred.resolve(creatorsInfo);
			})
			.fail(function (jqXHR, textStatus, errorThrown) {
				console.error('CRIADORES: An error occurred:', errorThrown);
				deferred.reject(errorThrown);
			});

		return deferred.promise();

	}

	function getGCDIssueFirst() {
		// Obtenha o elemento com o atributo data-source="First"
		var $element = $("div[data-source='First']");

		// Obtenha todo o texto presente nos elementos descendentes do elemento
		var text = $element.text();

		console.log(text); // Exibe todo o texto presente nos elementos descendentes

		// Expressão regular para localizar o nome antes de "#"
		var nameRegex = /^[^#]*/;

		// Obtenha o resultado da expressão regular
		var theName = text.match(nameRegex)[0];
		var name    = theName.replace(/\(.*?\)/, '').trim();
		// newString will be "Amazing Adventures"

		console.log(name); // Exibe "Marvel Presents"

		// Expressão regular para localizar o número a seguir a "#"
		var numberRegex = /#(\d+)/;

		// Obtenha o resultado da expressão regular
		var number = text.match(numberRegex)[1];

		console.log(number); // Exibe "5"

		// Expressão regular para localizar o ano dentro dos parênteses
		var yearRegex = /\(([^,]*),\s(\d+)/;

		// Obtenha o resultado da expressão regular
		var year = text.match(yearRegex)[2];

		console.log(year); // Exibe "1976"

		// Find the A tag from a parent tag with data-source="First"
		var aTag = $("[data-source='First'] a");

		// Get the text from the attribute title for the A tag
		var titleText = aTag.attr("title");

		// Remove the string "Vol" plus a space plus any number
		titleText = titleText.replace(/Vol\s\d+/g, "");
		titleText = titleText.replace(/  +/g, " ");
		console.log("titleText: ", titleText);
		console.log("Search URL: ", "https://concept.clerigo.pt/proxy.php?searchType=issue&issue=" + name + "&number=" + number + "&year=" + year);

		const deferred = $.Deferred();
		$.ajax({
			url     : "https://concept.clerigo.pt/proxy.php",
			dataType: "JSON",
			type    : "GET",
			data    : {
				searchType: 'issue',
				issue     : name,
				number    : number,
				year      : year
			},
			success : function (data) {
			},
			error   : function (jqXHR, textStatus, errorThrown) {
				console.error("IssueFirst: An error occurred: " + errorThrown);
			}
		})
			.done(function (data) {
				console.log('RESULTADO:', data.issue, "DATA: ", data.publication_date);
				const issueInfo        = data.issue;
				const publication_date = data.publication_date
				deferred.resolve(issueInfo);

			}).fail(function (jqXHR, textStatus, errorThrown) {
			console.error('IssueFirst: An error occurred:', errorThrown);
			deferred.reject(errorThrown);
		});
		return deferred.promise();

	}

	function getGCDIssueDeath() {
		// Obtenha o elemento com o atributo data-source="First"
		var $element = $("div[data-source='Death']");

		if ($element.length === 0) {
			return "NOTOK";
		}
		else {

			// Obtenha todo o texto presente nos elementos descendentes do elemento
			var text = $element.text();

			console.log(text); // Exibe todo o texto presente nos elementos descendentes

			// Expressão regular para localizar o nome antes de "#"
			var nameRegex = /^[^#]*/;

			// Obtenha o resultado da expressão regular
			var theName = text.match(nameRegex)[0];
			var name    = theName.replace(/\(.*?\)/, '').trim();
			// newString will be "Amazing Adventures"

			console.log(name); // Exibe "Marvel Presents"

			// Expressão regular para localizar o número a seguir a "#"
			var numberRegex = /#(\d+)/;

			// Obtenha o resultado da expressão regular
			var number = text.match(numberRegex)[1];

			console.log(number); // Exibe "5"

			// Expressão regular para localizar o ano dentro dos parênteses
			var yearRegex = /\(([^,]*),\s(\d+)/;

			// Obtenha o resultado da expressão regular
			var year = text.match(yearRegex)[2];

			console.log(year); // Exibe "1976"

			// Find the A tag from a parent tag with data-source="First"
			var aTag = $("[data-source='First'] a");

			// Get the text from the attribute title for the A tag
			var titleText = aTag.attr("title");

			// Remove the string "Vol" plus a space plus any number
			titleText = titleText.replace(/Vol\s\d+/g, "");
			titleText = titleText.replace(/  +/g, " ");
			console.log("titleText: ", titleText);
			console.log("Search URL: ", "https://concept.clerigo.pt/proxy.php?searchType=issue&issue=" + name + "&number=" + number + "&year=" + year);

			const deferred = $.Deferred();
			$.ajax({
				url     : "https://concept.clerigo.pt/proxy.php",
				dataType: "JSON",
				type    : "GET",
				data    : {
					searchType: 'issue',
					issue     : name,
					number    : number,
					year      : year
				},
				success : function (data) {
				},
				error   : function (jqXHR, textStatus, errorThrown) {
					console.error("IssueDeath: An error occurred: " + errorThrown);
				}
			})
				.done(function (data) {
					console.log('RESULTADO:', data.issue);
					const issueInfo = data.issue;
					deferred.resolve(issueInfo);
				}).fail(function (jqXHR, textStatus, errorThrown) {
				console.error('IssueDeath: An error occurred:', errorThrown);
				deferred.reject(errorThrown);
			});
			return deferred.promise();

		}
	}

})();
