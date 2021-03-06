function getURLParameter(name) {
	return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [
			, null ])[1]);
}

var periodo = 0;
var bandera_scroll = false;
var lastToast = 0;

$(document).on('pagebeforeshow', "#pageone", function(event, data) {
	periodo = getURLParameter("periodo")
	console.debug(periodo);

	var textoTitulo = "";

	if (periodo == 1)
		textoTitulo = 'Primer semestre';
	else if (periodo == 5)
		textoTitulo = 'Segundo semestre';
	else if (periodo == 2)
		textoTitulo = 'Vacaciones Junio';
	else if (periodo == 6)
		textoTitulo = 'Vacaciones Diciembre';
	else if (periodo == 14)
		textoTitulo = 'Exámenes 1er. Semestre';
	else if (periodo == 3)
		textoTitulo = '1ra. Retrasada 1er. Semestre';
	else if (periodo == 7)
		textoTitulo = '2da. Retrasada 1er. Semestre';
	else if (periodo == 15)
		textoTitulo = 'Exámenes 2do. Semestre';
	else if (periodo == 4)
		textoTitulo = '1ra. Retrasada 2do. Semestre';
	else if (periodo == 8)
		textoTitulo = '2da. Retrasada 2do. Semestre';

	else
		textoTitulo = 'Sin periodo a consultar';

	$('.titulo').text(textoTitulo);
});

$(document)
		.on(
				"pagecreate",
				"#pageone",
				function() {
					
					$("#listacursos")
							.on(
									"filterablebeforefilter",
									function(e, data) {
										var $ul = $(this), $input = $(data.input), value = $
												.trim($input.val()), html = "";
										$ul.html("");
										
										if (value && value.length > 3) { 
											
											$ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
											$ul.listview( "refresh" );
											$ul.trigger("updatelayout");
											var url = "http://externo.icon.com.gt/HorarioUsac/servicios/horarios?id="
													+ periodo;
											// var url =
											// "http://localhost:8080/HorarioUsac/servicios/horarios?id="+periodo;
											$
													.ajax(
															{
																url : url,
																dataType : "json",
																crossDomain : true,
																data : {
																	q : $input
																			.val()
																			.trim()
																}
															})
													.then(
															function(result) {
																$ul.html("");
																$('ul')
																		.listview(
																				'refresh');
																$ul.trigger("updatelayout");
																var list = "";
																var nombreCurso = "";
																for (var i = 0, l = result.length; i < l; i++) {
																	var tipo = "Clase Magistral";
																	var detalle = "";
																	var complemento = "";
																	var color = '#212121';
																	console
																			.debug("Tipo: "
																					+ result[i]["tipo"]);
																	// [1: Clase
																	// Magistral
																	// ][2:
																	// Laboratorio
																	// ][3:
																	// Trabajo
																	// Dirigido
																	// ][4:
																	// Dibujo
																	// ][5:
																	// Práctica
																	// ]
																	if (result[i]["tipo"] === 2) {
																		tipo = "Laboratorio";
																		color = '#3F51B5';
																	} else if (result[i]["tipo"] === 3) {
																		tipo = "Trabajo Dirigido"
																		color = '#7E57C2';
																	} else if (result[i]["tipo"] === 4) {
																		tipo = "Dibujo";
																		color = '#4CAF50';
																	} else if (result[i]["tipo"] === 5) {
																		tipo = "Práctica";
																		color = '#F44336';
																	}

																	
																	if ($
																			.inArray(
																					periodo,
																					[
																							'14',
																							'15',
																							'3',
																							'4',
																							'7',
																							'8' ]) >= 0) {
																		detalle += "Jornada: "
																				+ result[i]["detalle"];
																		tipo = "";
																	} else {
																		detalle = " - "
																				+ "Sección: "
																				+ result[i]["detalle"];
																	}

																	complemento = "<p>"
																			+ tipo
																			+ detalle
																			+ "</p></a>";

																	nombreCurso = "<a style=\"color:"+color+"\" href=\"detallecurso.html?p="
																			+ periodo
																			+ "&ic="
																			+ result[i]["idCurso"]
																			+ "\">"
																			+ result[i]["nombreCurso"]
																			+ complemento;
																	$(
																			'<li />',
																			{
																				html : nombreCurso
																			})
																			.appendTo(
																					'ul.listaCursos')

																	bandera_scroll = true;
																}

																if (!bandera_scroll) {
																	mostrarToast();
																} else {
																	$('ul')
																			.listview(
																					'refresh');
																	$ul
																			.trigger("updatelayout");
																}

															});
										}
									});
				});

$.mobile.filterable.prototype.options.filterCallback = function(index,
		searchValue) {
	//override para trim del filtro
};

function mostrarToast() {
	var now = (new Date()).getTime();
	if((now-lastToast) > 10000){
		window.plugins.toast
		.showShortCenter('No hay horarios publicados que coincidan con tu búsqueda.');
		lastToast = now;
    }
	
}


$(document).on("scrollstart", function() {
	if (bandera_scroll) {
		console.debug('Hide keyboard');
		document.activeElement.blur();
		bandera_scroll = false;
	}
});
