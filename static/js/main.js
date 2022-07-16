let products_cache = [];
let nits = firebase.database().ref('/clientes_nit/');

function searchNIT(){
	let text = document.getElementById('NIT').value;
	try {
		var ref = firebase.database().ref('/clientes_nit/' + text)
		ref.once('value', function (snapshot) {
			var obj = snapshot.val();
			if (obj != undefined) {
				document.getElementById('_client').value = obj.name;
				document.getElementById('_adress').value = obj.address;						
			}
		});
	} catch (error) {
		console.log(error)
	}
}

function addProduct(_val, _quantity, _concept, _price) {
	let random, table, row, cell1, cell2, cell3, cell4, cell5
	random = Math.floor(Math.random() * 1000001).toString();
	table = document.getElementById("tbl1");
	const n = document.getElementById("tbl1").rows.length;
	row = table.insertRow(n);
	cell1 = row.insertCell(0); //Suprimir
	cell2 = row.insertCell(1); //Cantidad
	cell3 = row.insertCell(2); //Concepto
	cell4 = row.insertCell(3); //Precio
	cell5 = row.insertCell(4); //Total

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
	let tabla = document.getElementById('tbl1')
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
		searchCode('price');
	} else if (document.getElementById('compra').checked){
		searchCode('price_compra');
	} else if (document.getElementById('escuela').checked){
		searchCode('price_escuela');
	} else if (document.getElementById('other').checked){
		searchCode('price_a');
	} else {
		alert('Seleccione la dirección de la base de datos.')
	}
}

function searchCode(reference){
	let _code, ref;
	if (document.getElementById("barcode").value != NaN || document.getElementById("barcode").value == ""){
	_code = document.getElementById("barcode").value;
	ref = firebase.database().ref('/productos/' + _code);
	ref.once('value', function (snapshot) {
        var obj = snapshot.val();
		if (obj != undefined) {
			if (duplicateProduct(obj.name, false)){
				console.log("Concepto actualizado")
				showTotal()
				document.getElementById("barcode").value = "";
			} else{
				addProduct(snapshot.key, 1, obj['name'], obj[reference]);
				document.getElementById("barcode").value = "";
			}						
		}		
    });
 	} else{
		alert("Ingresé un código")
 	}
}

function showTotal(){
	let table, aux;
	table = document.getElementById("tbl1");
	aux = 0;
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
	let _result = _quantity*_price;
	_result = parseFloat(_result).toFixed(2)
	return _result.toString()
}

function deleteProduct(variable){
	let tabla = document.getElementById("tbl1");
	for(let i in tabla.rows){	
		if (parseInt(i)){
			//console.log("Row Number: ",i);
			let text = tabla.rows[i].cells[0].innerHTML;
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
	let tabla = document.getElementById("tbl1");
	if (tabla.rows.length == 1){
		return false;
	}
	//Se recorre toda la tabla
	for(let i in tabla.rows){
		if (parseInt(i)){
			let text = tabla.rows[i].cells[2].innerHTML;
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

async function updateQuantity(key, q_one, q_two){
	try{
		console.log(typeof(q_one),  '', typeof(q_two))
		await firebase.database().ref('/productos/' + key).update({
			cantidad: (parseInt(q_one) - parseInt(q_two))
		});
	}catch(e){
		console.log('Error' + e);
	}
}

function toggle(){
	let blur, popup;
	blur = document.getElementsByClassName('grid-container');
	blur[0].classList.toggle('active');
	popup = document.getElementById('popup');
	popup.classList.toggle('active');
}

//Manda está información para el backend en python
function exportingAjax(){
	let temp, tabla, fel;
	fel = false;
	temp = [];
	tabla = document.getElementById("tbl1");
	const _nit = document.getElementById('NIT').value;
	const _fecha = document.getElementById("_fec").value;
	const _cliente = document.getElementById("_client").value;
	const _direccion = document.getElementById("_adress").value;
	
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
	const dict_values = { _nit, _fecha, _cliente, _direccion, products_cache, fel};
	const s = JSON.stringify(dict_values);

	try{
		$.ajax({
			url:"/",
			type:"POST",
			contentType: "application/json",
			data: JSON.stringify(s)
		});	
		toggle();
	}catch(error){
		alert('Error al exportal a Excel, intente de nuevo: ', error);
	}
}

function createFel(){
	let temp, tabla, fel;
	fel = true;
	temp = [];
	tabla = document.getElementById("tbl1");
	const _nit = document.getElementById('NIT').value;
	const _fecha = document.getElementById("_fec").value;
	const _cliente = document.getElementById("_client").value;
	const _direccion = document.getElementById("_adress").value;

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
	const dict_values = { _nit, _fecha, _cliente, _direccion, products_cache, fel};
	const s = JSON.stringify(dict_values);

	try{
		$.ajax({
			url:"/",
			type:"POST",
			contentType: "application/json",
			data: JSON.stringify(s)
		});	
	}catch(error){
		alert('Error al exportal a Excel, intente de nuevo: ', error);
	}
}

async function addProfit(){
	let today, mth, dd, mm, yyyy, temp, tabla, total_v;
	today = new Date();
	mth = new Object();
	mth = {
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
	dd = String(today.getDate()).padStart(2, '0');
	mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	yyyy = today.getFullYear();

	time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	today = yyyy + mm + dd + time;

	const database = firebase.database();
	temp = [0];
	tabla = document.getElementById("tbl1");

	total_v = document.getElementById('n_total').innerHTML;

	for(let i in tabla.rows){
		if (parseInt(i)){
			if (i == 0){
				console.log("Headers' row")
			} else {
				const code = tabla.rows[i].cells[0].getElementsByClassName('delete-button')[0].value;
				const _quantity = tabla.rows[i].cells[1].getElementsByTagName('input')[0].value;
				let name_concept = ''; 

				let ref = database.ref('/productos/' + code);
				await ref.once('value', function (snapshot){
					var obj = snapshot.val();
					if (obj != undefined){
						temp[0] += _quantity*parseFloat(obj['price_compra']);
						name_concept= obj['name'];				
					}
				});

				database.ref('/productos/').once('value',
				function(AllRecords){
					AllRecords.forEach(
						function(CurrentRecord){
							var name_concept_2 = CurrentRecord.val().name;
							if (name_concept_2 == name_concept) {
								//CurrentRecord.val().cantidad = '1000';
								//console.log(CurrentRecord.val().cantidad - _quantity)
								updateQuantity(CurrentRecord.key, CurrentRecord.val().cantidad, _quantity);
							}
						}
					);
				}
			);
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