var p = 0;
var ic = 0;
function getURLParameter(name) {
	return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [
			, null ])[1]);
}

$(document).one('pagebeforeshow', "#twoDetalle", function(event, data) {
	p = getURLParameter("p");
	ic = getURLParameter("ic");
});

$(document)
		.one(
				"pageshow",
				"#twoDetalle",
				function() {

					var textoTitulo = "";

					if ($.inArray(p, [ '14', '15', '3', '4', '7', '8' ]) >= 0) {
						textoTitulo = 'Detalle Examen';
					} else {
						textoTitulo = 'Detalle Curso';
					}

					$('.titulo').text(textoTitulo);

					var url = "http://externo.icon.com.gt/HorarioUsac/servicios/horarios/detalleHorario?p="
							+ p + "&ic=" + ic;
					$
							.getJSON(
									url,
									function(data) {
										if (p == 14 || p == 3 || p == 7
												|| p == 15 || p == 4 || p == 8) {
											var service_table = $('<table data-role="table"  data-mode="reflow" class="ui-responsive table-stroke" id="service"></table>');
											var service_tr_th = $("<thead><tr><th>C&oacutedigo</th><th>Curso</th><th>Jornada</th><th>Sal&oacuten</th><th>Hora</th><th>D&iacutea</th><th>Catedr&aacutetico</th><th>periodo</th></tr></thead>");
											var service_tbody = $('<tbody></tbody>');
											var service_tr = $('<tr></tr>');

											var dias = "- ";

											var service_name_td = $('<td><label id="codigo">'
													+ data["codigoCurso"]
													+ '</label></td>'
													+ '<td><label id="curso">'
													+ trim(data["nombreCurso"])
													+ '</label></td>'
													+ '<td><label id="seccion">'
													+ data["jornada"]
													+ '</label></td>'
													+ '<td><label id="salon">'
													+ data["edificio"]
													+ ' '
													+ data["salon"]
													+ '</label></td>'
													+ '<td><label id="hora">'
													+ data["horaInicio"]
													+ '</label></td>'
													+ '<td><label id="dias">'
													+ data["dia"]
													+ '</label></td>'
													+ '<td style="display:none;><label id="catedratico"></label></td>'
													+ '<td style="display:none;"><label id="periodo">'
													+ p + '</label></td>'

											);
										} else {
											var service_table = $('<table data-role="table"  data-mode="reflow" class="ui-responsive table-stroke" id="service"></table>');
											var service_tr_th = $("<thead><tr><th>C&oacutedigo</th><th>Curso</th><th>Secci&oacuten</th><th>Sal&oacuten</th><th>Hora</th><th>D&iacuteas</th><th>Catedr&aacutetico</th><th>periodo</th></tr></thead>");
											var service_tbody = $('<tbody></tbody>');
											var service_tr = $('<tr></tr>');

											var dias = "- ";

											if (data["lunes"] == "X") {
												dias = dias + "Lun - ";
											}
											if (data["martes"] == "X") {
												dias = dias + "Mar - ";
											}
											if (data["miercoles"] == "X") {
												dias = dias + "Mie - ";
											}
											if (data["jueves"] == "X") {
												dias = dias + "Jue - ";
											}
											if (data["viernes"] == "X") {
												dias = dias + "Vie - ";
											}
											if (data["sabado"] == "X") {
												dias = dias + "Sab - ";
											}

											var service_name_td = $('<td><label id="codigo">'
													+ data["codigoCurso"]
													+ '</label></td>'
													+ '<td><label id="curso">'
													+ trim(data["nombreCurso"])
													+ '</label></td>'
													+ '<td><label id="seccion">'
													+ data["seccion"]
													+ '</label></td>'
													+ '<td><label id="salon">'
													+ data["edificio"]
													+ ' '
													+ data["salon"]
													+ '</label></td>'
													+ '<td><label id="hora">'
													+ data["horaInicio"]
													+ ' - '
													+ data["horaFin"]
													+ '</label></td>'
													+ '<td><label id="dias">'
													+ dias
													+ '</label></td>'
													+ '<td><label id="catedratico">'
													+ data["catedratico"]
													+ '</label></td>'
													+ '<td style="display:none;"><label id="periodo">'
													+ p + '</label></td>'

											);

										}

										var boton = $('<a id="btnAgregar" href="#popupCloseRight" class="ui-btn"  data-position-to="window"  onclick="addTodo()">Agregar a tu horario</a>');
										service_name_td.appendTo(service_tr);
										service_tr_th.appendTo(service_table);
										service_tr.appendTo(service_tbody);
										service_tbody.appendTo(service_table);
										service_table
												.appendTo($("#categories"));
										boton.appendTo($("#categories"));
										service_table.table();
										return false;

									});

				});

function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g, "");
}
