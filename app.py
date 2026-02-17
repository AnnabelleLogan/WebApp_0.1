import sqlite3
from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('Index.html')

@app.route('/handle_form', methods=['POST'])
def handle_form():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    action = request.form.get('action')

    conn = sqlite3.connect('UserDatabase.db')
    cursor = conn.cursor()

    if action == 'register':
        cursor.execute("INSERT INTO users (username, email, password) VALUES (?,?,?)", (username, email, password))
        conn.commit()
        message = "Account Created!"

    elif action == 'login':
        cursor.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password))
        user = cursor.fetchone()
        if user:
            message = f"Welcome back, {username}!"
        else:
            message = "Login Failed: Wrong email or password"

    conn.close()
    return message
if __name__ == '__main__':
    app.run(debug=True, port=8001)