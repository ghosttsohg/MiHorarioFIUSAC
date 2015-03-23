function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

var periodo = 0;

$(document).on('pagebeforeshow', "#pageone", function (event, data) {
	periodo = getURLParameter("periodo")
	console.debug(periodo);
	
	var textoTitulo = "";
	
	if(periodo == 1)
		textoTitulo = 'Primer semestre';
	else if(periodo == 5)
		textoTitulo = 'Segundo semestre';
	else if(periodo == 2)
		textoTitulo = 'Vacaciones Junio';
	else if(periodo == 6)
		textoTitulo = 'Vacaciones Diciembre';
	else if(periodo == 14)
		textoTitulo = 'Exámenes 1er. Semestre';
	else if(periodo == 3)
		textoTitulo = '1ra. Retrasada 1er. Semestre';
	else if(periodo == 7)
		textoTitulo = '2da. Retrasada 1er. Semestre';
	else if(periodo == 15)
		textoTitulo = 'Exámenes 2do. Semestre';
	else if(periodo == 4)
		textoTitulo = '1ra. Retrasada 2do. Semestre';
	else if(periodo == 8)
		textoTitulo = '2da. Retrasada 2do. Semestre';

	else
		textoTitulo = 'Sin periodo a consultar';
	
	$('.titulo').text(textoTitulo);
});

$( document ).on( "pagecreate", "#pageone", function() {
		
	$( "#listacursos" ).on( "filterablebeforefilter", function ( e, data ) {
        var $ul = $( this ),
            $input = $( data.input ),
            value = $.trim($input.val()),
            html = "";
        	$ul.html( "" );
        if ( value && value.length > 3 ) { //Ignoramos preposiciones y articulos, longitud minima de palabra en curso 4chars
            $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
            //$ul.listview( "refresh" );
		var url = "http://externo.icon.com.gt/HorarioUsac/servicios/horarios?id="+periodo;	
//		var url = "http://localhost:8080/HorarioUsac/servicios/horarios?id="+periodo;
            $.ajax({
                url: url,
                dataType: "json",
                crossDomain: true,
                data: {
                    q: $input.val().trim()
                }
            })
            .then( function ( result ) {
		$('ul').listview('refresh');                
		var list = "";
		var nombreCurso = "";
		var tipo = "Clase Magistral";
		for (var i = 0, l = result.length; i < l; i++) {
			var detalle = "";
			var complemento = "";
			console.debug("Tipo: "+result[i]["tipo"]);
			//[1: Clase Magistral ][2: Laboratorio ][3: Trabajo Dirigido ][4: Dibujo ][5: Práctica ]
			if(result[i]["tipo"]===2){
				tipo = "Laboratorio";
			}else if(result[i]["tipo"]===3){
				tipo = "Trabajo Dirigido"
			}else if(result[i]["tipo"]===4){
				tipo = "Dibujo"
			}else if(result[i]["tipo"]===5){
				tipo = "Práctica"
			}
			
			if($.inArray(periodo,[14,15,3,4,7,8]) >= 0){
				detalle += "Jornada: "+result[i]["detalle"];
				tipo = "";
			}
			else{
				detalle += "Sección: "+result[i]["detalle"];
			}
			
			complemento = "<p>"+tipo+" - "+detalle+"</p></a>";
			
			nombreCurso = "<a href=\"detallecurso.html?p="+periodo+"&ic="+result[i]["idCurso"]+"\">"
					+ result[i]["nombreCurso"]
					+ complemento;
			$('<li />', {
				html : nombreCurso
			}).appendTo('ul.listaCursos')
		}

		$('ul').listview('refresh');                
		$ul.trigger( "updatelayout");
            });
        }
    });
});

$.mobile.filterable.prototype.options.filterCallback = function( index, searchValue ) {
//override para trim del filtro
};




//document.addEventListener("backbutton", function(){
//	alert("Boton atras");
//    var now = (new Date()).getTime();
//    if((now-controller.util.lastBackBtnTap) < 1000){
//        navigator.app.exitApp();
//    }
//    else{
//        controller.util.lastBackBtnTap = now;
//        controller.util.showToast(controller.util.getString('doubleTapToExit'));
//    }
//
//}, false);
