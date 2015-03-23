var p;
function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

$(document).on("pageshow", function(event, data) {
	
	p = getURLParameter("p"); 
	var ic = getURLParameter("ic"); 
	
	var url = "http://externo.icon.com.gt/HorarioUsac/servicios/horarios/detalleHorario?p=" + p + "&ic=" + ic;
//	var url = "http://localhost:8080/HorarioUsac/servicios/horarios/detalleHorario?p=" + p + "&ic=" + ic;
	$.getJSON(url, function(data) {
    //data is the JSON string
		var service_table = $('<table data-role="table"  data-mode="reflow" class="ui-responsive table-stroke" id="service"></table>');
		var service_tr_th = $("<thead><tr><th>C&oacutedigo</th><th>Curso</th><th>Secci&oacuten</th><th>Salon</th><th>Hora</th><th>D&iacuteas</th><th>Catedr&aacutetico</th><th>periodo</th></tr></thead>");
		var service_tbody = $('<tbody></tbody>');
		var service_tr = $('<tr></tr>');
		
		var dias ="- ";
		
		if (data["lunes"]=="X"){ dias = dias + "Lun - ";}
		if (data["martes"]=="X"){ dias = dias + "Mar - ";}
		if (data["miercoles"]=="X"){ dias = dias + "Mie - ";}
		if (data["jueves"]=="X"){ dias = dias + "Jue - ";}
		if (data["viernes"]=="X"){ dias = dias + "Vie - ";}
		if (data["sabado"]=="X"){ dias = dias + "Sab - ";}
	
		var service_name_td = $(
								'<td><label id="codigo">' + data["codigoCurso"] + '</label></td>'
								+'<td><label id="curso">' + trim(data["nombreCurso"]) + '</label></td>'
								+'<td><label id="seccion">' + data["seccion"] + '</label></td>'
								+'<td><label id="salon">' + data["edificio"] + ' ' + data["salon"]  + '</label></td>'
								+'<td><label id="hora">' + data["horaInicio"]  + ' - ' + data["horaFin"] + '</label></td>'
								+'<td><label id="dias">' + dias + '</label></td>'
								+'<td><label id="catedratico">' + data["catedratico"] + '</label></td>'
								+'<td style="display:none;"><label id="periodo">' + p + '</label></td>'
								
										);
		service_name_td.appendTo(service_tr);
		service_tr_th.appendTo(service_table);
		service_tr.appendTo(service_tbody);
		service_tbody.appendTo(service_table);
		service_table.appendTo($("#categories"));

		service_table.table();
		
	});
	
});

function trim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}
