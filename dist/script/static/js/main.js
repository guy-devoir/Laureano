//Añadir producto
var products_cache = [];
var precio_de_costo = [];
let ymc = 0;
//Aquí tengo que añadir el la verificación de si está repetido, y conectarlo a Firebase

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
	cell1.contentEditable = false;
	cell2.innerHTML = _quantity;
	cell3.innerHTML = _concept;
	cell4.innerHTML = parseFloat(_price).toFixed(2);
	const _result = totalPrice(_quantity, _price)
	cell5.innerHTML =  _result;
	
	showTotal();
	document.getElementById('quant').value = "";
	document.getElementById('conc').value = "";
	document.getElementById('_cu').value = "";
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

//Funciones aritmeticas
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

//Auxiliares
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
	//console.log(_concept);
	var tabla = document.getElementById("tbl1");
	//Se comprueba que la tabla sea lo suficientemente grande

	if (tabla.rows.length == 1){
		return false;
	}
	//Se recorre toda la tabla
	for(let i in tabla.rows){
		//console.log("i es: ",i);
		//console.log("Debería de ",parseInt(i))
		if (parseInt(i)){
			var text = tabla.rows[i].cells[2].innerHTML;
			if (text == _concept) {
				//Si ha sido una opción manual, hay que añadir tantos como lo haya querido metido en cantidad
				tabla.rows[i].cells[1].innerHTML = _manual ? parseInt(tabla.rows[i].cells[1].innerHTML) + parseInt(document.getElementById('quant').value) : parseInt(tabla.rows[i].cells[1].innerHTML)+1;
				const _result = totalPrice(tabla.rows[i].cells[1].innerHTML, tabla.rows[i].cells[3].innerHTML)
				tabla.rows[i].cells[4].innerHTML = _result;
				return true;
			}
		}
	}
	return false;
}

function rework(){
	var tabla = document.getElementById("tbl1");
	for (let i in tabla.rows){
		if (parseInt(i)){
			tabla.rows[i].cells[4].innerHTML = totalPrice(parseInt(tabla.rows[i].cells[1].innerHTML.replace('<br>','')), parseFloat(tabla.rows[i].cells[3].innerHTML.replace('<br>','')));
		}
	}
	showTotal();
}

function exporting_ajax(){
	gettingRaw()
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
				aux.push(tabla.rows[i].cells[1].innerHTML.replace('<br>',''));
				aux.push(tabla.rows[i].cells[2].innerHTML.replace('<br>',''));
				aux.push(tabla.rows[i].cells[3].innerHTML.replace('<br>',''));
				temp.push(aux);
			}
		} else {
			console.log("Index undefined: ", i);
		}
	}
	products_cache = temp;
	const dict_values = { _nit, _fecha, _cliente, _direccion, products_cache};
	const s = JSON.stringify(dict_values);
	
	console.log(s);
	/*
	Ventas del día... LPM,
	La definición de "¿No quiere pollo también?".
	*/
	$.ajax({
		url:"/",
		type:"POST",
		contentType: "application/json",
		data: JSON.stringify(s)
	})

	
}

function gettingRaw(){
	precio_de_costo = [];
	var database = firebase.database();
	var tabla = document.getElementById("tbl1");
	for (let i in tabla.rows){
		if (parseInt(i)){
			if (i == 0){
				console.log("Headers' row")
			} else {
				try{
					var _code = tabla.rows[i].cells[0].getElementsByClassName('delete-button')[0].value;
					var ref = database.ref(/productos-compra/ + _code);
					ref.once('value', function (snapshot) {
						var obj = snapshot.val();
						if (obj != undefined) {
							var suma_aux = parseFloat(obj.price)*parseInt(tabla.rows[i].cells[1].innerHTML.replace('<br>',''));
							precio_de_costo.push(suma_aux);
						} 
					});
				}catch{
					console.log('No reference')
				}
			}
		} else {
			console.log("Index undefined: ", i);
		}
	}
	sumaArray()
}

function addSell(){
	var database = firebase.database();
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();;
	database.ref('/ventas/' + date).set({
		costo: ymc,
		ganancia: parseFloat(document.getElementById('n_total').innerHTML)+ymc,
		venta: document.getElementById('n_total').innerHTML
	});
}

function sumaArray(){
	for(let i = 0; i < precio_de_costo.length; i++){
		ymc = ymc + parseFloat(precio_de_costo[i])
	}
	addSell();
}

//No mando ninguna forma por lo que está bien... creo
window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = 'It looks like you have been editing something. '
                            + 'If you leave before saving, your changes will be lost.';
    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});