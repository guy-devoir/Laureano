var products_cache = [];

function addProduct(_val, _quantity, _concept, _price) {
	var random = Math.floor(Math.random() * 1000001).toString();
	var table = document.getElementById("tbl1");
	const n = document.getElementById("tbl1").rows.length;
	var row = table.insertRow(n);
	var cell1 = row.insertCell(0); //Suprimir
	var cell2 = row.insertCell(1); //Cantidad
	var cell3 = row.insertCell(2); //Concepto
	var cell4 = row.insertCell(3); //Precio
	var cell5 = row.insertCell(4); //Total

	cell1.innerHTML = "<button class='delete-button' value='"+ _val +"' onclick=\"deleteProduct('producto_" + random + "')\"></button>";
	//Celda 2
	cell2.innerHTML = "<input onclick='update_table("+random+")' onkeyup='update_table("+random+")' type='number' style='width: 69px' min='1'>";
	cell2.getElementsByTagName('input')[0].value = _quantity;
	//Celda 3
	cell3.innerHTML = _concept;
	cell3.contentEditable = true;
	//Celda 4
	cell4.innerHTML = "<input onkeyup='update_table("+random+")' type='text' style='width: 40px'>";
	cell4.getElementsByTagName('input')[0].value = parseFloat(_price).toFixed(2);

	const _result = totalPrice(_quantity, _price)
	cell5.innerHTML = _result;
	cell5.contentEditable = false;
	
	showTotal();
	document.getElementById('quant').value = "";
	document.getElementById('conc').value = "";
	document.getElementById('_cu').value = "";
}

function update_table(variable){
	var tabla = document.getElementById('tbl1')
	for(let i in tabla.rows){	
		if (parseInt(i)){
			//console.log("Row Number: ",i);
			var text = tabla.rows[i].cells[0].innerHTML;
			if (text.includes(variable)){
				var tst = tabla.rows[i].cells;
				tabla.rows[i].cells[4].innerHTML = totalPrice(tst[1].getElementsByTagName('input')[0].value, tst[3].getElementsByTagName('input')[0].value);
				showTotal();
				return true;
			} 
		}
	}
	return false;
}

function manualAdd(){
	if(parseFloat(document.getElementById('_cu').value) || parseInt(document.getElementById('quant').value)){
		if(document.getElementById('conc').value != ""){
			if (duplicateProduct(document.getElementById('conc').value, true)){
				console.log("Concepto actualizado")
				document.getElementById('quant').value = "";
				document.getElementById('conc').value = "";
				document.getElementById('_cu').value = "";
			} else{
				addProduct('null',parseInt(document.getElementById('quant').value), document.getElementById('conc').value, parseFloat(document.getElementById('_cu').value))
			}
		} else{
			alert("Campo \"Concepto\" Requerido")
		}		
	} else{
		alert("El campo \"Cantidad\" / \"Precio Unitario\" solo aceptan números")
	}
}

function sectionSelected(){
	if (document.getElementById('general').checked){
		searchCode('/productos/');
	} else if (document.getElementById('compra').checked){
		searchCode('/productos-compra/');
	} else if (document.getElementById('escuela').checked){
		searchCode('/productos-escuelas/');
	} else if (document.getElementById('other').checked){
		searchCode('/productos-other/');
	} else {
		alert('Seleccione la dirección de la base de datos.')
	}
}

function searchCode(reference){
	if (document.getElementById("barcode").value != NaN || document.getElementById("barcode").value == ""){
	var _code = document.getElementById("barcode").value;
	var ref = firebase.database().ref(reference + _code);
	ref.once('value', function (snapshot) {
        var obj = snapshot.val();
		//console.log(_code, obj.name, obj.price)
		if (obj != undefined) {
			if (duplicateProduct(obj.name, false)){
				console.log("Concepto actualizado")
				showTotal()
				document.getElementById("barcode").value = "";
			} else{
				addProduct(snapshot.key, 1, obj.name, obj.price);
				document.getElementById("barcode").value = "";
			}						
		}		
    });
 	} else{
		alert("Ingresé un código")
 	}
}

function showTotal(){
	var table = document.getElementById("tbl1");
	var aux = 0;
	for (let i in table.rows) {
		if (parseInt(i)) {
			if (parseInt(i) != 0) {
				aux = aux + parseFloat(table.rows[i].cells[4].innerHTML);
			}
		}
	}
	document.getElementById('n_total').innerHTML = parseFloat(aux).toFixed(2);
}

function totalPrice(_quantity, _price){
	var _result = _quantity*_price;
	_result = parseFloat(_result).toFixed(2)
	return _result.toString()
}

function deleteProduct(variable){
	var tabla = document.getElementById("tbl1");
	for(let i in tabla.rows){	
		if (parseInt(i)){
			//console.log("Row Number: ",i);
			var text = tabla.rows[i].cells[0].innerHTML;
			if (text.includes(variable)){
				tabla.deleteRow(i);
				showTotal();
				return true;
			} 
		}
	}
	return false;
}

function duplicateProduct(_concept, _manual){
	var tabla = document.getElementById("tbl1");
	if (tabla.rows.length == 1){
		return false;
	}
	//Se recorre toda la tabla
	for(let i in tabla.rows){
		if (parseInt(i)){
			var text = tabla.rows[i].cells[2].innerHTML;
			if (text == _concept) {
				//Si ha sido una opción manual, hay que añadir la cantidad en '#quant'
				tabla.rows[i].cells[1].getElementsByTagName('input')[0].value = _manual ? parseInt(tabla.rows[i].cells[1].getElementsByTagName('input')[0].value) + parseInt(document.getElementById('quant').value) : parseInt(tabla.rows[i].cells[1].getElementsByTagName('input')[0].value)+1;
				const _result = totalPrice(tabla.rows[i].cells[1].getElementsByTagName('input')[0].value, tabla.rows[i].cells[3].getElementsByTagName('input')[0].value)
				tabla.rows[i].cells[4].innerHTML = _result;
				return true;
			}
		}
	}
	return false;
}

function toggle(){
	var blur = document.getElementsByClassName('grid-container');
	blur[0].classList.toggle('active');
	var popup = document.getElementById('popup');
	popup.classList.toggle('active');
}

//Manda está información para el backend en python
function exportingAjax(){
	var temp = [];
	const _nit = document.getElementById('NIT').value;
	const _fecha = document.getElementById("_fec").value;
	const _cliente = document.getElementById("_client").value;
	const _direccion = document.getElementById("_adress").value;
	var tabla = document.getElementById("tbl1");
	
	for (let i in tabla.rows){
		if (parseInt(i)){
			if (i == 0){
				console.log("Headers' row")
			} else {
				const aux = [];
				aux.push(tabla.rows[i].cells[1].getElementsByTagName('input')[0].value);
				aux.push(tabla.rows[i].cells[2].innerHTML.replace('<br>',''));
				aux.push(tabla.rows[i].cells[3].getElementsByTagName('input')[0].value);
				temp.push(aux);
			}
		} else {
			console.log("Index undefined: ", i);
		}
	}
	products_cache = temp;
	const dict_values = { _nit, _fecha, _cliente, _direccion, products_cache};
	const s = JSON.stringify(dict_values);

	try{
		$.ajax({
			url:"/",
			type:"POST",
			contentType: "application/json",
			data: JSON.stringify(s)
		})	
		toggle();
	}catch(error){
		alert('Error al exportal a Excel, intente de nuevo: ', error);
	}
}

async function addProfit(){
	var today = new Date();
	var mth = new Object();
	var mth = {
		'01': 'Enero',
		'02': 'Febrero',
		'03': 'Marzo',
		'04': 'Abril',
		'05': 'Mayo',
		'06': 'Junio',
		'07': 'Julio',
		'08': 'Agosto',
		'09': 'Septiembre',
		'10': 'Octubre',
		'11': 'Noviembre',
		'12': 'Diciembre'
	};
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	today = yyyy + mm + dd + time;

	const database = firebase.database();
	var temp = [0];
	var tabla = document.getElementById("tbl1");

	var total_v = document.getElementById('n_total').innerHTML;

	for(let i in tabla.rows){
		if (parseInt(i)){
			if (i == 0){
				console.log("Headers' row")
			} else {
				const code = tabla.rows[i].cells[0].getElementsByClassName('delete-button')[0].value;
				const _quantity = tabla.rows[i].cells[1].getElementsByTagName('input')[0].value;

				var ref = database.ref('/productos-compra/' + code);
				await ref.once('value', function (snapshot){
					var obj = snapshot.val();
					if (obj != undefined){
						temp[0] += _quantity*parseFloat(obj.price);				
					}
				});
			}
		} else {
			console.log("Index undefined: ", i);
		}
	}

	database.ref(/ventas/ + today).set({
		anio: yyyy,
		mes: mth[mm],
		dia: dd,
		hora: time,
		costo: temp[0],
		ganancia: parseFloat(total_v) - parseFloat(temp[0]),
		venta: total_v
	});

	toggle();
}

//Para evitar que se pierda la información de la página
window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = 'It looks like you have been editing something. '
                            + 'If you leave before saving, your changes will be lost.';
    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});

//El autofocus en id='barcode' y está función hacen más inmediata la interacción
window.addEventListener('load', function (){
	document.getElementById('general').checked = true;
});