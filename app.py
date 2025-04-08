from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Semplice login hardcoded
USERNAME = "admin"
PASSWORD = "password123"

@app.route("/login", methods=["POST"])
def login():
    dati = request.json
    if dati["username"] == USERNAME and dati["password"] == PASSWORD:
        return jsonify({"success": True})
    return "Unauthorized", 401

@app.route("/salva-canti", methods=["POST"])
def salva_canti():
    dati = request.json
    with open("canti.json", "w", encoding="utf-8") as f:
        json.dump(dati, f, ensure_ascii=False, indent=2)
    return jsonify({"success": True})

@app.route("/canti.json")
def get_canti():
    return send_from_directory(".", "canti.json")