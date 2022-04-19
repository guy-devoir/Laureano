from flask import Flask, request, render_template
from flask_cors import CORS
from excel_handling import *
from flaskwebgui import FlaskUI
import os
import json
import sys

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
        print(json_object.keys())
        excel.create_xlsx(json_object['_nit'], json_object['_fecha'], json_object['_cliente'], json_object['_direccion'], json_object['products_cache'])
    else:
        return render_template('index.html')
    return render_template('index.html')

@app.route('/about')
def about_page():
    return render_template('about.html')

@app.route('/add')
def add_p():
    return render_template('add.html')

@app.route('/inv')
def inventory():
    return render_template('inventory.html')    

if __name__ == '__main__':
    #os.startfile('http://127.0.0.1:4000/')
    app.run(debug=True, port=4000)
    #ui.run()