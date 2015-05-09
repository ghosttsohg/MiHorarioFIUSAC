function checkConnection() {
    var respuesta = false;
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    
    if(networkState != Connection.NONE)
    	respuesta = true;
    
    return respuesta;
}

if(!checkConnection()){
	$('.consultas').hide();
	window.plugins.toast.showShortCenter('Sin conexión a internet. Consultas de horarios no disponibles.');
}