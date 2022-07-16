var database = firebase.database()

//Functions for inventory.html
function addProduct(){
    var barcode = document.getElementById('barcode').value;
    var concepto =  document.getElementById('_conc').value;
    var price = document.getElementById('cu').value;
    var quant = document.getElementById('qua').value;
    console.log(barcode, '+', concepto, '+', price);
    
    try{
        if (barcode != ""){
            if (concepto !=""){
                if (price != ""){
                    
                    database.ref('/productos/'+barcode).set({
                        name : concepto,
                        price : price,
                        price_escuela: price,
                        price_compra: price,
                        price_a : price,
                        price_b: price,
                        cantidad: quant
                        
                    });
                    document.getElementById('barcode').value = "";
                    document.getElementById('_conc').value = "";
                    document.getElementById('cu').value = "";
                }else{
                    alert('Precio Unitario DEBE de ser llenado')
                    
                }
                
            }else{
                alert('Concepto DEBE de ser llenado')
                
            }
        }else{
            alert('Barcode DEBE de ser llenado')
            
        }
    }catch (error) {
        console.error(error);
        alert("Database Error");
    }
    console.log(x)
}

function getAllProducts(){
    var table = document.getElementById("inv");

    database.ref('/productos/').once('value',
        function(AllRecords){
            AllRecords.forEach(
                function(CurrentRecord){
                    var key = CurrentRecord.key;
                    var name = CurrentRecord.val().name;
                    var precio = CurrentRecord.val().price;
                    var cantidad = CurrentRecord.val().cantidad;
                    
                    var n = table.rows.length;
                    var row = table.insertRow(n);

                    var cell1 = row.insertCell(0); //Botón
                    var cell2 = row.insertCell(1); //Código 
                    var cell3 = row.insertCell(2); //Nombre
                    var cell4 = row.insertCell(3); //Precio
                    var cell5 = row.insertCell(4);

                    cell1.innerHTML = "<a onclick='selectProduct("+n+")'><i class='fas fa-edit'></i><span>Edit</span></a>";
                    cell2.innerHTML = key;
                    cell3.innerHTML = name;
                    cell4.innerHTML = parseFloat(precio).toFixed(2);
                    cell5.innerHTML = cantidad;
                    document.getElementById('tbl_length').innerHTML = 'No. de Códigos de Barras: ' + String(n + 1);
                }
            );
        }
    );
}

function selectProduct(n){
    var table = document.getElementById("inv").rows[n];
    var reference = table.cells[1].innerHTML;
    var ref = firebase.database().ref('/productos/' + reference);

    document.getElementById('barcode_id').innerHTML = reference;
    document.getElementById('_conc_update').value = table.cells[2].innerHTML;
    document.getElementById('cu_upt').value = table.cells[3].innerHTML; 
    
    ref.once('value', function (snapshot){
        var obj = snapshot.val();
        if (obj != undefined){
            document.getElementById('qua_upt').value = obj.cantidad;
            document.getElementById('cu_sch_upt').value = obj.price_escuela;        
            document.getElementById('cu_buy_upt').value = obj.price_compra;
            document.getElementById('cu_a_upt').value = obj.price_a;         
        }
    });   
}

async function checkDiv(variable){
    let div_list, length, bar_array, text, quantity;
    div_list = document.getElementById('dcont1').getElementsByTagName('div');
    length = div_list.length;
    for(let i = 0; i < length; i++){
        text = div_list[i].innerHTML;
        if (text.includes(variable)){
            bar_array = await searchTable(false, i);
            for (let j = 0; j < bar_array.length; j++){
                quantity = div_list[i].getElementsByTagName('p')['qant'].innerText;
                database.ref('/productos/' + bar_array[j]).update({
                    cantidad : quantity
                });
            }
            div_list[i].remove();
            return true;
        }
    }
}

function deleteDiv(){
    let div_list, length, text;
    div_list = document.getElementById('dcont1').getElementsByTagName('div');
    length = div_list.length;
    for(let i = 0; i < length; i++){
        text = div_list[i].innerHTML;
        if (text.includes(variable)){
            div_list[i].remove();
            return true;
        }
    }
}

async function updateProduct(){
    let code, concepto, cantidad, price, price_escuela, price_compra, price_a;
    code = document.getElementById('barcode_id').innerHTML;
    concepto =  document.getElementById('_conc_update').value;
    cantidad = document.getElementById('qua_upt').value;
    price = document.getElementById('cu_upt').value;
    price_escuela = document.getElementById('cu_sch_upt').value;
    price_compra = document.getElementById('cu_buy_upt').value;
    price_a = document.getElementById('cu_a_upt').value;
    //console.log(code, '+', concepto, '+', price);
    try{
        if (barcode != ""){
            if (concepto !=""){
                await database.ref('/productos/' + code).update({
                    name : concepto,
                    cantidad : cantidad,
                    price : price,
                    price_escuela: price_escuela,
                    price_compra: price_compra,
                    price_a: price_a
                });

                document.getElementById('barcode_id').innerHTML = "";
                document.getElementById('_conc_update').value = "";
                document.getElementById('qua_upt').value = 0;
                document.getElementById('cu_upt').value = 0;
                document.getElementById('cu_sch_upt').value = 0;
                document.getElementById('cu_buy_upt').value = 0;
                document.getElementById('cu_a_upt').value = 0;
            }else{
                alert('Concepto DEBE de ser llenado')
            }
        }else{
            alert('Barcode DEBE de ser llenado')
        }
    } catch (error) {
        console.log(error)
        alert("Database Error: " + error);
    }
    
    alert('Actualizado ' + code);
    document.getElementById("inv").innerHTML = "<th style=\"width: 20px;\"></th><th style=\"width: 130px;\">Código</th><th style=\"width: 350px;\">Nombre</th><th style=\"width: 53px; font-size: small;\">Precio</th><th style=\"width: 53px; font-size: small;\">Cantidad</th>";  
    getAllProducts();
}

async function exportingDeliveries(){
    let temp, div_list, length_div, i;
	temp = '{\n"pedidos": [\n';
    div_list = document.getElementById('dcont1').getElementsByTagName('div');
	length_div = parseInt(div_list.length) - 1;
    i = 0;

     while(true){
        let current = div_list[i].getElementsByTagName('p');
        if (i < length_div){
            temp += '{"desc":"'+ current['desc'].innerHTML +'", "expec":"' + current['expec'].innerHTML + '", "obs":"' + current['obs'].innerHTML + '", "qant": "'+ current['qant'].innerHTML +'"},\n';
            i++;
        } else {
            temp += '{"desc":"'+ current['desc'].innerHTML +'", "expec":"' + current['expec'].innerHTML + '", "obs":"' + current['obs'].innerHTML + '", "qant": "'+ current['qant'].innerHTML + '"}\n]\n}'; 
            break;
        }
    }

	try{
		$.ajax({
			url:"/inv",
			type:"POST",
			contentType: "application/json",
			data: JSON.stringify(temp)
		})	
		toggle();
        openInputField(false);
	}catch(error){
		alert(error);
	}
}

//Functions for NIT contacts.html
function addNIT(){
    let nit, address, name, tel;
    nit = document.getElementById('nit_client').value;
    address = document.getElementById('address_client').value;
    name = document.getElementById('name_client').value;
    tel = document.getElementById('_tel').value;

    try {
        if (nit != ""){
            if (address != ""){
                database.ref('/clientes_nit/'+ nit).set({
                    address: address,
                    name : name,
                    tel : tel
                });
                document.getElementById('nit_client').value = "";
                document.getElementById('address_client').value = "";
                document.getElementById('name_client').value = "";
                document.getElementById('_tel').value = "";
            } else{
                alert('Dirección DEBE de ser llenado')
            }
        } else {
            alert('NIT DEBE de ser llenado')
        }
    } catch (error) {
        console.error(error);
        alert("Database Error");
    }

}