var database = firebase.database()

function addProduct(){
    var barcode = document.getElementById('barcode').value;
    var concepto =  document.getElementById('_conc').value;
    var price = document.getElementById('cu').value;
    console.log(barcode, '+', concepto, '+', price);
    x = 0
    try{
        if (barcode != ""){
            if (concepto !=""){
                if (price != ""){
                    x = x + 1
                    database.ref('/productos/'+barcode).set({
                        name : concepto,
                        price : price
                    });
                    document.getElementById('barcode').value = "";
                    document.getElementById('_conc').value = "";
                    document.getElementById('cu').value = "";
                }else{
                    alert('Precio Unitario DEBE de ser llenado')
                    x = x+2
                }
                
            }else{
                alert('Concepto DEBE de ser llenado')
                x = x+2
            }
        }else{
            alert('Barcode DEBE de ser llenado')
            x = x+2
        }
    }catch (error) {
        console.error(error);
        alert("Database Error");
    }
    console.log(x)
}

function addNIT(){
    var nit = document.getElementById('nit_client').value;
    var address =  document.getElementById('address_client').value;
    var name = document.getElementById('name_client').value;
    var tel = document.getElementById('_tel').value;

    try {
        database.ref('/clientes_nit/'+ nit).set({
            address: address,
            name : name,
            tel : tel
        });
        document.getElementById('nit_client').value = "";
        document.getElementById('address_client').value = "";
        document.getElementById('name_client').value = "";
        document.getElementById('_tel').value = "";
    } catch (error) {
        console.error(error);
        alert("Database Error");
    }

}