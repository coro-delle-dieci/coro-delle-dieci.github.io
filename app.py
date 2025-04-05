from flask import Flask, render_template, request, redirect, url_for, jsonify, session
import json, os
from datetime import timedelta

app = Flask(__name__)
app.secret_key = "supersegreto"
app.permanent_session_lifetime = timedelta(hours=2)

DATA_FILE = "data/canti.json"
USERS = {"user": "password"}  # Puoi cambiare queste credenziali

@app.route("/")
def home():
    return redirect(url_for("login"))

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        if USERS.get(username) == password:
            session["user"] = username
            return redirect(url_for("admin"))
        return render_template("login.html", error="Credenziali errate.")
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect(url_for("login"))

@app.route("/admin")
def admin():
    if "user" not in session:
        return redirect(url_for("login"))
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        canti = json.load(f)
    return jsonify(canti)

@app.route("/update", methods=["POST"])
def update():
    if "user" not in session:
        return "Unauthorized", 401
    data = request.json
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    return "OK"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)