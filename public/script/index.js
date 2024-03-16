"use strict";

let divMenu = null;
let divContent = null;
let userID;

document.addEventListener("DOMContentLoaded", (e) => {
    divMenu = document.getElementById("divMenu");
    divContent = document.getElementById("divContent");

    userID = parseInt(localStorage.getItem("userID"));
    if (userID) {
        showNotes(); // Vis notatfeltet hvis brukeren er logget inn
    } else {
        showLogin();
    }
});

function showCreateUser() {
    loadTemplate("menu_1", divMenu, true);
    loadTemplate("createUser", divContent, true);
    const createUserButton = document.getElementById("createUserButton");

    createUserButton.onclick = async function (e) {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("pswHash").value;
        sha256(password, async (pswHash) => {
            const user = { name, email, pswHash };
            const response = await postTo("/user", user);
            if (response.ok) {
                showNotes(); // Kaller funksjonen for å vise notatene etter at en bruker er opprettet
            }
        });
    };
}

function showLogin() {
    loadTemplate("loginUser", divContent, true);

    const loginButton = document.getElementById("loginButton");
    loginButton.onclick = async function (e) {
        const email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPswHash").value;
        sha256(password, async (pswHash) => {
            let user = { email, pswHash };
            console.log(user);
            const resp = await postTo("/user/login", user);
            if (resp.ok) {
                const shema = await resp.json();
                console.log(shema);
                userID = shema.data.id;
                localStorage.setItem("userID", userID);
                location.reload();
            }
        });
    };
}

function showNotes() {
    loadTemplate("menu_1", divMenu, true);
    loadTemplate("Notes", divContent, true);

    const saveNoteButton = document.getElementById("saveNoteButton");
    saveNoteButton.addEventListener("click", saveNote);
}

function showMessage(message) {
    const messageBox = document.createElement("div");
    messageBox.classList.add("message-box");
    messageBox.textContent = message;
    document.body.appendChild(messageBox);

    // Fjern meldingsboksen etter 3 sekunder
    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}

async function saveNote() {
    const noteTitle = document.getElementById("noteTitle").value;
    const userNotes = document.getElementById("userNotes").value;
    const userID = parseInt(localStorage.getItem("userID")); // Hent brukerens ID

    // Send notatet til serveren for lagring i databasen
    const response = await postTo("/notes", { title: noteTitle, content: userNotes, userID });
    if (response.ok) {
        showMessage("Notatet er lagret!"); // Vis en meldingsboks til brukeren
    } else {
        showMessage("Det oppstod en feil ved lagring av notatet."); // Vis en meldingsboks om feil
    }
}

