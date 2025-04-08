from flask import Flask, request, jsonify, session, redirect
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "supersegretissimo")
CORS(app, supports_credentials=True)

# Utente autorizzato
UTENTE = {
    "username": "admin",
    "password": "password123"
}

# Salvataggio in memoria (potresti poi passare a un file JSON o DB)
canti_domenica = []

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if data["username"] == UTENTE["username"] and data["password"] == UTENTE["password"]:
        session["user"] = data["username"]
        return jsonify({"success": True})
    return jsonify({"success": False}), 401

@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    return jsonify({"success": True})

@app.route("/api/canti", methods=["GET", "POST"])
def gestisci_canti():
    if request.method == "POST":
        if session.get("user") != UTENTE["username"]:
            return jsonify({"error": "Non autorizzato"}), 403
        global canti_domenica
        canti_domenica = request.get_json()[:10]
        return jsonify({"success": True})

    return jsonify({
        "data": canti_domenica,
        "domenica": datetime.now().strftime("domenica %-d %B")
    })
    
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)