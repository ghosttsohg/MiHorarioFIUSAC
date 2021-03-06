//Based on http://www.html5rocks.com/en/tutorials/webdatabase/todo/

var app = {};
app.db = null;

app.openDb = function() {
	app.db = window.openDatabase("MiHorario2", "1.1", "MiHorario2", 500000);
}

app.createTable = function() {
	var db = app.db;
	db
			.transaction(function(tx) {
				tx
						.executeSql(
								"CREATE TABLE IF NOT EXISTS bdMiHorario2(ID INTEGER PRIMARY KEY ASC, periodoId  INTEGER, codigo TEXT, curso TEXT, seccion TEXT, salon TEXT, hora TEXT, dias TEXT, catedratico TEXT, added_on DATETIME, tipo INTEGER)",
								[]);
			});
}

app.addTodo = function(periodoId, codigo, curso, seccion, salon, hora, dias,
		catedratico,tipo) {
	var db = app.db;
	db
			.transaction(function(tx) {
				var addedOn = new Date();
				var textoHorario = 'curso';
				if ($.inArray(periodoId, [ '14', '15', '3', '4', '7', '8' ]) >= 0) {
					textoHorario = 'examen';
				}
				// var lblMensaje = document.getElementById("lblMensaje");

				tx
						.executeSql(
								'SELECT COUNT(*) AS c FROM  bdMiHorario2 where periodoId = '
										+ periodoId + ' and codigo="' + codigo
										+ '" and dias="'+dias
										+ '" and hora="'+hora
										+ '" and seccion="'+seccion
										+ '" and tipo='+tipo,
								[],
								function(tx, r) {
									if (r.rows.item(0).c > 0) {
										// lblMensaje.innerHTML = "El curso ya
										// existe en tu Horario";
										window.plugins.toast
												.showShortCenter('El '
														+ textoHorario
														+ ' ya existe en tu horario.');

										$('#btnAgregar').hide();

									} else {

										tx
												.executeSql(
														"INSERT INTO bdMiHorario2(periodoId, codigo, curso, seccion, salon, hora, dias, catedratico, added_on,tipo) VALUES (?,?,?,?,?,?,?,?,?,?)",
														[ periodoId, codigo,
																curso, seccion,
																salon, hora,
																dias,
																catedratico,
																addedOn, tipo ],
														app.onSuccess,
														app.onError);
										// lblMensaje.innerHTML = "El curso se
										// ha agregado a Mi Horario";
										window.plugins.toast
												.showShortCenter('El '
														+ textoHorario
														+ ' se ha agregado a tu horario.');

									}
								});
			});

}

app.onError = function(tx, e) {
	console.log("Error: " + e.message);
}

app.onSuccess = function(tx, r) {
	console.log("Success!!");
}

app.onSuccessRefresh = function(tx, r) {
	app.refresh();
}

function eliminar(buttonIndex) {
	if (buttonIndex == 1) {
		app.deleteTodo(0);
	} else
		return false;
}

function eliminarTodo(buttonIndex) {
	if (buttonIndex == 1) {
		app.deleteTodoAll();
	} else
		return false;
}

var borrarId = 0;

function showConfirm(id) {
	borrarId = id;
	navigator.notification.confirm(
			'¿Estás seguro que deseas borrar este horario?', // message
			eliminar, // callback to invoke with index of button pressed
			'Confirmación', // title
			'Si,No' // buttonLabels
	);
}

function showConfirmAll() {
	navigator.notification.confirm(
			'¿Estás seguro que deseas borrar todos los horarios?', // message
			eliminarTodo, // callback to invoke with index of button pressed
			'Confirmación', // title
			'Si,No' // buttonLabels
	);
}

app.deleteTodo = function(id) {
	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM bdMiHorario2 WHERE ID=?", [ borrarId ], app
				.onSuccessRefresh(), app.onError);
	});
}

app.deleteTodoAll = function() {
	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM bdMiHorario2 ", [], app.onSuccessRefresh(),
				app.onError);
	});
}

app.addToCalendar = function(idPeriodo, dia, curso, jornada, salon, hora) {

	var hoy = new Date();
	var anio = hoy.getFullYear();
	var mes = 11;

	if (idPeriodo == 14)
		mes = 4;
	else if (idPeriodo == 15)
		mes = 10;
	else if (idPeriodo == 3)
		mes = 4;
	else if (idPeriodo == 4)
		mes = 10;
	else if (idPeriodo == 7)
		mes = 6;
	else if (idPeriodo == 8)
		mes = 0;

	var arrayDia = dia.split(" ");
	var arrayHora = hora.split(":");

	var startDate = new Date(anio, mes, arrayDia[1], arrayHora[0],
			arrayHora[1], 0, 0, 0);
	var endDate = new Date(anio, mes, arrayDia[1], parseInt(arrayHora[0]) + 1,
			arrayHora[1], 0, 0, 0);
	var title = "Examen: " + curso;
	var eventLocation = salon;
	var notes = "Jornada: " + jornada;
	var success = function(message) {
		console.debug("Evento agregado con éxito: " + JSON.stringify(message));
	};
	var error = function(message) {
		console.debug("Error: " + message);
	};

	window.plugins.calendar.createEventInteractively(title, eventLocation,
			notes, startDate, endDate, success, error);

}

app.refresh = function() {
	var renderTodo = function(row) {

		var periodoName = "";
		if (row.periodoId == 1)
			periodoName = "Cursos Primer Semestre";
		else if (row.periodoId == 2)
			periodoName = "Cursos Segundo Semestre";
		else if (row.periodoId == 14)
			periodoName = "Exámenes Finales Primer Semestre";
		else if (row.periodoId == 15)
			periodoName = "Exámenes Finales Segundo Semestre";
		else if (row.periodoId == 3)
			periodoName = "Primera Retrasada Primer Semestre";
		else if (row.periodoId == 4)
			periodoName = "Primera Retrasada Segundo Semestre";
		else if (row.periodoId == 7)
			periodoName = "Segunda Retrasada Primer Semestre";
		else if (row.periodoId == 8)
			periodoName = "Segunda Retrasada Segundo Semestre";
		else if (row.periodoId == 2)
			periodoName = "Segundo Semestre";

		var codigoColor = '#212121';

		if(row.tipo==2)
			codigoColor = '#3F51B5';
		else if (row.tipo==3)
			codigoColor = '#7E57C2';			
		else if (row.tipo==4)
			codigoColor = '#4CAF50';		
		else if (row.tipo==5)
			codigoColor = '#F44336';			
	

		if (row.periodoId == 14 || row.periodoId == 3 || row.periodoId == 7
				|| row.periodoId == 15 || row.periodoId == 4
				|| row.periodoId == 8) {
			return "<li style=\"color:#FF5722\" periodo='"
					+ periodoName
					+ "' data-icon='delete' class='ui-first-child ui-last-child'><a href='#' class='ui-icon-delete'>"
					+ "<h2 style=\"color:#FF5722\">"
					+ row.codigo
					+ " "
					+ row.curso
					+ "</h2>"
					+ "<p>Jornada: "
					+ row.seccion
					+ "</p>"
					+ "<p>Sal&oacuten: "
					+ row.salon
					+ "</p>"
					+ "<p>Hora: "
					+ row.hora
					+ "</p>"
					+ "<p>D&iacutea: "
					+ row.dias
					+ "</p>" // idPeriodo,dia,curso,jornada,salon,hora
					+ "<button onclick='app.addToCalendar("
					+ row.periodoId
					+ ",\""
					+ row.dias
					+ "\",\""
					+ row.curso
					+ "\",\""
					+ row.seccion
					+ "\",\""
					+ row.salon
					+ "\",\""
					+ row.hora
					+ "\");' class=\"ui-btn ui-btn-icon-left ui-icon-calendar\">Agregar a calendario</button>"
					+ "</a><a href=\"#\" onclick='showConfirm("
					+ row.ID
					+ "); return false;' class='ui-btn ui-btn-icon-right ui-icon-delete'>Delete</a></li>"
		} else {
			/*
			 * return "<li periodo='"+periodoName+"' data-icon='delete' class='ui-first-child ui-last-child'><a
			 * href='javascript:void(0);' onclick='app.deleteTodo(" + row.ID +
			 * ");' class='ui-btn ui-btn-icon-right ui-icon-delete'>" +"<h2>" +
			 * row.codigo + " " + row.curso + "</h2>" +"<p>Secci&oacuten: " +
			 * row.seccion + "</p>" +"<p>Salon: " + row.salon + "</p>" +"<p>Hora: " +
			 * row.hora + "</p>" +"<p>D&iacutea: " + row.dias + "</p>" +"<p>Catedratico: " +
			 * row.catedratico + "</p>" +"</a></li>"
			 */

			return "<li periodo='"
					+ periodoName
					+ "' data-icon='delete' class='ui-first-child ui-last-child'><a href='#' class='ui-icon-delete'>"
					+ "<h2 style=\"color:"+codigoColor+"\">"
					+ row.codigo
					+ " "
					+ row.curso
					+ "</h2>"
					+ "<p>Secci&oacuten: "
					+ row.seccion
					+ "</p>"
					+ "<p>Sal&oacuten: "
					+ row.salon
					+ "</p>"
					+ "<p>Hora: "
					+ row.hora
					+ "</p>"
					+ "<p>D&iacutea: "
					+ row.dias
					+ "</p>"
					+ "<p>Catedr&aacutetico: "
					+ row.catedratico
					+ "</p>"
					+ "</a><a href=\"#\"  onclick='showConfirm("
					+ row.ID
					+ "); return false;' class='ui-btn ui-btn-icon-right ui-icon-delete'>Delete</a></li>"

		}

	}

	var render = function(tx, rs) {
		var rowOutput = "";
		var todoItems = document.getElementById("todoItems");
		var hayCursos = false;
		
		for (var i = 0; i < rs.rows.length; i++) {
			rowOutput += renderTodo(rs.rows.item(i));
			hayCursos = true;
		}

		todoItems.innerHTML = rowOutput;
		
		if(!hayCursos){
			$("#botonBorrar").hide();
			window.plugins.toast
			.showShortCenter('Ve a la sección de cursos o exámenes para agregar nuevos horarios');
			
		}

		$("#todoItems").listview({
			autodividers : true,
			autodividersSelector : function(li) {
				var out = li.attr('periodo');
				return out;
			}
		}).listview('refresh');

	}

	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM bdMiHorario2 ORDER BY periodoId, codigo", [],
				render, app.onError);
	});
}

function init() {
	app.openDb();
	app.createTable();
}

function addTodo() {
	init();
	var codigo = $("#codigo").text();
	var curso = $("#curso").text();
	var seccion = $("#seccion").text();
	var salon = $("#salon").text();
	var hora = $("#hora").text();
	var dias = $("#dias").text();
	var catedratico = $("#catedratico").text();
	var periodo = $("#periodo").text();
	var tipo = $("#tipoid").text();
	app
			.addTodo(periodo, codigo, curso, seccion, salon, hora, dias,
					catedratico,tipo);
}

function selectAll() {
	app.openDb();
	app.createTable();
	app.refresh();
}

function deleteAll() {
	app.openDb();
	app.createTable();
	app.deleteTodoAll();
	app.refresh();
}

function exists(periodoId, codigo) {
	var db = app.db;
	var x;
	db.readTransaction(function(tx) {
		tx.executeSql(
				'SELECT COUNT(*) AS c FROM  bdMiHorario2 where periodoId = '
						+ periodoId + ' and codigo="' + codigo + '"', [],
				function(tx, r) {
					return r.rows.item(0).c;
				});
	});

}
