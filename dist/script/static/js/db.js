var database = firebase.database()

function addProduct(){
    var barcode = document.getElementById('barcode').value;
    var concepto =  document.getElementById('_conc').value;
    var price = document.getElementById('cu').value;
    console.log(barcode, '+', concepto, '+', price);
    
    try{
        if (barcode != ""){
            if (concepto !=""){
                if (price != ""){
                    
                    database.ref('/productos/'+barcode).set({
                        name : concepto,
                        price : price
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

function addNIT(){
    var nit = document.getElementById('nit_client').value;
    var address = document.getElementById('address_client').value;
    var name = document.getElementById('name_client').value;
    var tel = document.getElementById('_tel').value;

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