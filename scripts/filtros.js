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
		for (var i = 0, l = result.length; i < l; i++) {
			nombreCurso = "<a href=\"detallecurso.html?p=1&ic="+result[i]["idCurso"]+"\">"
					+ result[i]["nombreCurso"]
					+ "</a>";
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
