from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Esempio route principale per mostrare index.html
@app.route('/')
def home():
    return render_template('index.html')

# API per ottenere i canti
@app.route('/api/canti', methods=['GET'])
def get_canti():
    try:
        with open('canti.json', 'r') as f:
            canti = f.read()
        return canti, 200, {'Content-Type': 'application/json'}
    except FileNotFoundError:
        return jsonify([])

# API per aggiornare i canti
@app.route('/api/canti', methods=['POST'])
def set_canti():
    dati = request.get_json()
    if not isinstance(dati, list) or len(dati) > 10:
        return jsonify({'errore': 'Massimo 10 canti'}), 400
    with open('canti.json', 'w') as f:
        import json
        json.dump(dati, f)
    return jsonify({'ok': True})

# Partenza del server su Render
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)