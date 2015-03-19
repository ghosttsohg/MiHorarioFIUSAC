//Based on http://www.html5rocks.com/en/tutorials/webdatabase/todo/


var app = {};
app.db = null;
      
app.openDb = function() {
        app.db = window.openDatabase("PushAndSync", "1.0", "PushAndSync", 500000);   	
}
      
app.createTable = function() {
	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS bdMiHorario(ID INTEGER PRIMARY KEY ASC, periodoId  INTEGER, codigo INTEGER, curso TEXT, seccion TEXT, salon TEXT, hora TEXT, dias TEXT, catedratico TEXT, added_on DATETIME)", []);
	});
}
      
app.addTodo = function(periodoId,codigo,curso, seccion, salon, hora, dias, catedratico) {
	var db = app.db;
	db.transaction(function(tx) {
		var addedOn = new Date();
		
		
			var lblMensaje = document.getElementById("lblMensaje");

			tx.executeSql('SELECT COUNT(*) AS c FROM  bdMiHorario where periodoId = ' + periodoId + ' and codigo=' + codigo, [], function (tx, r) {
				if(r.rows.item(0).c > 0){
					lblMensaje.innerHTML = "El curso ya existe en Mi Horario";							
					
				}
				else
				{
			
					tx.executeSql("INSERT INTO bdMiHorario(periodoId, codigo, curso, seccion, salon, hora, dias, catedratico, added_on) VALUES (?,?,?,?,?,?,?,?,?)",
					  [periodoId,codigo,curso, seccion, salon, hora, dias, catedratico, addedOn],
					  app.onSuccess,
					  app.onError);			
					  lblMensaje.innerHTML = "El curso se ha agregado a Mi Horario";							
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
      
app.deleteTodo = function(id) {
	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM bdMiHorario WHERE ID=?", [id],
					  app.onSuccessRefresh(),
					  app.onError);
	});
}

app.deleteTodoAll = function() {
	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM bdMiHorario ", [],
					  app.onSuccess,
					  app.onError);
	});
}

app.refresh = function() {
	var renderTodo = function (row) {
		return "<li data-icon='delete' class='ui-first-child ui-last-child'><a href='javascript:void(0);'  onclick='app.deleteTodo(" + row.ID + ");' class='ui-btn ui-btn-icon-right ui-icon-delete'>"
		+"<h2>" + row.codigo + " " + row.curso + "</h2>"
		+"<p>Secci&oacuten: " + row.seccion + "</p>"
		+"<p>Salon: " + row.salon + "</p>"
		+"<p>Hora: " + row.hora + "</p>"
		+"<p>D&iacutea: " + row.dias + "</p>"
		+"<p>Catedratico: " + row.catedratico + "</p>"
		+"</a></li>"
	}
    
	var render = function (tx, rs) {
		var rowOutput = "";
		var todoItems = document.getElementById("todoItems");
		for (var i = 0; i < rs.rows.length; i++) {
			rowOutput += renderTodo(rs.rows.item(i));
		}
      
		todoItems.innerHTML = rowOutput;
		
	}
    
	var db = app.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM bdMiHorario", [], 
					  render, 
					  app.onError);
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
	app.addTodo(periodo,codigo, curso, seccion, salon, hora, dias, catedratico);
}


function selectAll(){
	app.openDb();
	app.createTable();
	app.refresh();
}

function deleteAll(){
	app.openDb();
	app.createTable();
	app.deleteTodoAll();
	app.refresh();
}


function exists(periodoId,codigo){
	var db = app.db;
    var x;
    db.readTransaction(function (tx) {
        tx.executeSql('SELECT COUNT(*) AS c FROM  bdMiHorario where periodoId = ' + periodoId + ' and codigo=' + codigo, [], function (tx, r) {
            alert(r.rows.item(0).c);
			return r.rows.item(0).c;
        });
    });
    
}

