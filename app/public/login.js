const path = require("path");
const fs = require("fs");
async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    try {
        const response = await fetch("/passwords");
        const data = await response.json();

        const user = data.users.find(u => u.username === username && u.password === password);

        if (user) {
            if(username == 'admin') {
              window.location.href = "/dashboard"
            } else {
              if(username == 'Deleter') {
                window.location.href = "/delete"
              }
            }
        } else {
            errorMessage.textContent = "Falscher Benutzername oder Passwort!";
        }
    } catch (error) {
        errorMessage.textContent = "Fehler beim Laden der Benutzerdaten!";
    }
}// wait why