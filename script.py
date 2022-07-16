from flask import Flask, request, render_template
from flask_cors import CORS
from excel_handling import *
from flaskwebgui import FlaskUI
import json
from fel import *

app = Flask(__name__, template_folder='templates')
ui = FlaskUI(app, maximized=True, close_server_on_exit=False, port='4000')

CORS(app)

app.config.update(
    TESTING=True,
    SECRET_KEY='192b9bdd22ab9ed4d12e236c78afcb9a393ec15f71bbf5dc987d54727823bcbf'
)

@app.route('/', methods=['GET','POST'])
def main_page():
    if request.method == 'POST':
        output = request.get_json()
        json_object = json.loads(output)
        excel = JSON_to_excel()
        fel = WebAutomaton()
        #print(json_object.keys())
        if (json_object['fel']):
            fel.invoice_SAT(json_object['_nit'], json_object['_fecha'], json_object['_cliente'], json_object['_direccion'], json_object['products_cache'])
            return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
        else:
            excel.create_xlsx(json_object['_nit'], json_object['_fecha'], json_object['_cliente'], json_object['_direccion'], json_object['products_cache'])
            return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
    else:
        return render_template('index.html')

@app.route('/about')
def about_page():
    return render_template('about.html')

@app.route('/add')
def add_p():
    return render_template('add.html')

@app.route('/profits')
def see_profits():
    return render_template('profits.html')

@app.route('/inv', methods=['GET','POST'])
def inventory():
    if request.method == 'POST':
        output = request.get_json()
        with open("tocome.json", "w") as f:
            f.write(output)
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
    else:
        with open('tocome.json', 'r') as f:
            f_content = f.read()
            json_f = json.loads(f_content)
            pedidos = json_f['pedidos']
            return render_template('inventory.html', len = len(pedidos), Pedidos = pedidos)

@app.route('/contacts')    
def contacts():
    return render_template('contacts.html')

if __name__ == '__main__':
    app.run(debug=True, port=4000)
    #ui.run()